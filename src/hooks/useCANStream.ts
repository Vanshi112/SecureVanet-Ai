import { useState, useEffect, useRef, useCallback } from 'react';
import { CANPacket, VehicleStatus, ThreatSeverity, LiveStreamMode, AttackType } from '../types';
import { canSimulator } from '../services/canStreamSimulator';
import { realWebSocketService } from '../services/websocketService';
import { useNotifications } from '../store/NotificationContext';

export function useCANStream() {
  const [mode, setMode] = useState<LiveStreamMode>('simulation');
  const [isPaused, setIsPaused] = useState(false);
  const [packets, setPackets] = useState<CANPacket[]>([]);
  const [totalPacketsCount, setTotalPacketsCount] = useState(14820);
  const [packetsPerSec, setPacketsPerSec] = useState(1420);
  const [currentThreatLevel, setCurrentThreatLevel] = useState<ThreatSeverity>('Normal');
  const [activeAttackType, setActiveAttackType] = useState<AttackType>('Normal');
  const [modelLatencyMs, setModelLatencyMs] = useState(0.8);
  const [isWsConnected, setIsWsConnected] = useState(false);

  const [vehicle, setVehicle] = useState<VehicleStatus>({
    speed: 78.4,
    rpm: 2450,
    brake: false,
    gear: 'D',
    steeringAngle: 1.2,
    busLoad: 28.5,
    lastUpdated: new Date().toISOString(),
  });

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] SocketCAN interface can0 initialized (500000 bps)`,
    `[${new Date().toLocaleTimeString()}] Transformer IDS v1.0 classifier thread running on GPU:0`,
    `[${new Date().toLocaleTimeString()}] Listening for CAN frame stream...`,
  ]);

  const { addNotification } = useNotifications();
  const lastSecCountRef = useRef(0);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const handleIncomingPacket = useCallback((packet: CANPacket, updatedVehicle?: VehicleStatus) => {
    if (isPausedRef.current) return;

    setTotalPacketsCount(prev => prev + 1);
    lastSecCountRef.current += 1;

    if (updatedVehicle) {
      setVehicle(updatedVehicle);
    }

    setPackets(prev => [packet, ...prev.slice(0, 199)]);

    if (packet.prediction === 'Attack' || packet.severity === 'High' || packet.severity === 'Critical') {
      setCurrentThreatLevel(packet.severity);
      setActiveAttackType(packet.attack_type);

      const logLine = `[ALERT] ${packet.timestamp.split('T')[1].slice(0, 8)} | ${packet.can_id} | ATTACK DETECTED: ${packet.attack_type} (${packet.severity}) | Confidence: ${packet.confidence.toFixed(1)}%`;
      setTerminalLogs(prev => [...prev.slice(-99), logLine]);

      if (packet.severity === 'Critical' || packet.severity === 'High') {
        addNotification(
          `ATTACK DETECTED: ${packet.attack_type}`,
          `High-threat anomalous frame detected on CAN ID ${packet.can_id} with ${packet.confidence.toFixed(1)}% confidence.`,
          'critical',
          'attack'
        );
      }
    } else {
      if (Math.random() < 0.1) {
        setCurrentThreatLevel('Normal');
        setActiveAttackType('Normal');
      }
    }

    setModelLatencyMs(parseFloat((0.7 + Math.random() * 0.4).toFixed(2)));
  }, []);

  useEffect(() => {
    if (mode === 'simulation') {
      realWebSocketService.disconnect();
      const unsubscribe = canSimulator.subscribe(handleIncomingPacket);
      canSimulator.start(120);
      addNotification('Mode Switch', 'Switched to CAN Telemetry Simulation Mode', 'info', 'can');
      return () => {
        unsubscribe();
        canSimulator.stop();
      };
    } else {
      canSimulator.stop();
      realWebSocketService.connect();
      const unsubMessage = realWebSocketService.onMessage(handleIncomingPacket);
      const unsubStatus = realWebSocketService.onStatus((connected, err) => {
        setIsWsConnected(connected);
        if (connected) {
          addNotification('WebSocket Connected', 'Subscribed to live SocketCAN stream /ws/live', 'success', 'can');
        } else if (err) {
          addNotification('WebSocket Error', err, 'error', 'can');
        }
      });

      return () => {
        unsubMessage();
        unsubStatus();
        realWebSocketService.disconnect();
      };
    }
  }, [mode]);

  useEffect(() => {
    const timer = setInterval(() => {
      const count = lastSecCountRef.current;
      lastSecCountRef.current = 0;
      setPacketsPerSec(1350 + count * 12 + Math.floor(Math.random() * 50));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const injectAttack = (attackType: AttackType) => {
    canSimulator.injectAttack(attackType, 12);
    addNotification('Attack Injected', `Simulating ${attackType} attack injection on CAN bus`, 'warning', 'attack');
  };

  const clearAttack = () => {
    canSimulator.clearAttack();
    setCurrentThreatLevel('Normal');
    setActiveAttackType('Normal');
    addNotification('Attack Cleared', 'CAN bus telemetry reset to nominal state', 'info', 'can');
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  const clearTerminalLogs = () => {
    setTerminalLogs([`[${new Date().toLocaleTimeString()}] IDS Terminal log cleared`]);
  };

  return {
    mode,
    setMode,
    isPaused,
    togglePause,
    packets,
    vehicle,
    totalPacketsCount,
    packetsPerSec,
    currentThreatLevel,
    activeAttackType,
    modelLatencyMs,
    isWsConnected,
    terminalLogs,
    injectAttack,
    clearAttack,
    clearTerminalLogs,
  };
}

