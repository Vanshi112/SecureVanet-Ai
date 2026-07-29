import { CANPacket, VehicleStatus, ThreatSeverity, AttackType } from '../types';
import { getSeverityFromAttack } from '../utils/threats';

export type CANPacketCallback = (packet: CANPacket, vehicle: VehicleStatus) => void;

class CANStreamSimulator {
  private intervalId: any = null;
  private isRunning = false;
  private packetCount = 0;
  private activeAttack: AttackType | null = null;
  private attackDurationRemaining = 0;

  private vehicleState: VehicleStatus = {
    speed: 78.4,
    rpm: 2450,
    brake: false,
    gear: 'D',
    steeringAngle: 1.2,
    busLoad: 28.5,
    lastUpdated: new Date().toISOString(),
  };

  private listeners: CANPacketCallback[] = [];

  public start(frequencyMs = 150) {
    if (this.isRunning) return;
    this.isRunning = true;

    this.intervalId = setInterval(() => {
      this.tick();
    }, frequencyMs);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  public injectAttack(attackType: AttackType, durationSeconds = 10) {
    this.activeAttack = attackType;
    this.attackDurationRemaining = durationSeconds * 6.5;
  }

  public clearAttack() {
    this.activeAttack = null;
    this.attackDurationRemaining = 0;
  }

  public subscribe(callback: CANPacketCallback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private tick() {
    this.packetCount++;

    this.updateVehicleDynamics();

    let isAttack = false;
    let attackType: AttackType = 'Normal';
    let prediction: 'Normal' | 'Attack' | 'Suspicious' = 'Normal';
    let confidence = 98.2 + (Math.random() * 1.7);

    if (this.activeAttack && this.attackDurationRemaining > 0) {
      isAttack = true;
      attackType = this.activeAttack;
      prediction = 'Attack';
      confidence = 94.5 + (Math.random() * 5.2);
      this.attackDurationRemaining--;
      if (this.attackDurationRemaining <= 0) {
        this.activeAttack = null;
      }
    } else {
      if (Math.random() < 0.03) {
        prediction = 'Suspicious';
        attackType = 'Anomaly Noise';
        confidence = 72.4 + (Math.random() * 12.0);
      }
    }

    const severity: ThreatSeverity = getSeverityFromAttack(attackType, confidence);

    const canIdList = ['0x0154', '0x018F', '0x02A0', '0x02C0', '0x0316', '0x0430', '0x0545'];
    const canId = isAttack && attackType === 'DoS' ? '0x0000' : canIdList[Math.floor(Math.random() * canIdList.length)];
    const payload = this.generatePayload(canId, isAttack);

    const packet: CANPacket = {
      id: `pkt-${Date.now()}-${this.packetCount}`,
      timestamp: new Date().toISOString(),
      can_id: canId,
      dlc: 8,
      payload,
      prediction,
      attack_type: attackType,
      severity,
      confidence,
    };

    const updatedVehicle: VehicleStatus = {
      ...this.vehicleState,
      lastUpdated: new Date().toISOString(),
    };

    this.listeners.forEach(fn => fn(packet, updatedVehicle));
  }

  private updateVehicleDynamics() {
    if (this.activeAttack === 'DoS') {
      this.vehicleState.busLoad = Math.min(98.5, this.vehicleState.busLoad + 5.0);
    } else if (this.activeAttack === 'Fuzzy') {
      this.vehicleState.speed = Math.max(0, Math.min(180, this.vehicleState.speed + (Math.random() * 20 - 10)));
      this.vehicleState.rpm = Math.max(800, Math.min(7000, this.vehicleState.rpm + (Math.random() * 600 - 300)));
      this.vehicleState.busLoad = 75.2;
    } else if (this.activeAttack === 'RPM') {
      this.vehicleState.rpm = 6850;
      this.vehicleState.busLoad = 52.0;
    } else {
      this.vehicleState.speed = Math.max(40, Math.min(120, this.vehicleState.speed + (Math.random() * 0.8 - 0.4)));
      this.vehicleState.rpm = Math.max(1500, Math.min(3500, Math.round(this.vehicleState.speed * 31.2 + (Math.random() * 40 - 20))));
      this.vehicleState.steeringAngle = parseFloat((Math.sin(Date.now() / 2000) * 8.5).toFixed(1));
      this.vehicleState.busLoad = parseFloat((25 + Math.random() * 8.0).toFixed(1));
      this.vehicleState.brake = this.vehicleState.speed < 45;
    }
  }

  private generatePayload(canId: string, isAttack: boolean): string {
    if (isAttack && this.activeAttack === 'DoS') {
      return '00 00 00 00 00 00 00 00';
    }
    if (isAttack && this.activeAttack === 'Fuzzy') {
      const bytes = Array.from({ length: 8 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase());
      return bytes.join(' ');
    }
    const b1 = Math.floor(this.vehicleState.speed).toString(16).padStart(2, '0').toUpperCase();
    const b2 = Math.floor(this.vehicleState.rpm / 256).toString(16).padStart(2, '0').toUpperCase();
    const b3 = Math.floor(this.vehicleState.rpm % 256).toString(16).padStart(2, '0').toUpperCase();
    return `${b1} ${b2} ${b3} 08 20 00 1A 4F`;
  }
}

export const canSimulator = new CANStreamSimulator();

