
export interface KernelModule {
  id: string;
  name: string;
  version: string;
  description: string;
  status: 'LOADED' | 'UNLOADED' | 'ERROR';
  type: 'DRIVER' | 'SYSTEM' | 'USERLAND';
}

export interface KernelMessage {
  sourceId: string;
  targetId: string;
  payload: string;
  timestamp: number;
}

class KernelService {
  private modules: Map<string, KernelModule>;
  private eventLog: string[];

  constructor() {
    this.modules = new Map([
      ['core_gov', { id: 'core_gov', name: 'GlassHouse Governance', version: '1.2.0', description: 'Core transparency module for APBDes', status: 'LOADED', type: 'SYSTEM' }],
      ['net_warga', { id: 'net_warga', name: 'Warga-Net Protocol', version: '0.9.5', description: 'Mesh network connectivity driver', status: 'LOADED', type: 'DRIVER' }],
      ['pay_sys', { id: 'pay_sys', name: 'WargaPay Payment Gateway', version: '2.1.0', description: 'Financial transaction processor', status: 'LOADED', type: 'SYSTEM' }],
      ['env_sense', { id: 'env_sense', name: 'EnviroSense IoT Driver', version: '1.0.1', description: 'Driver for flood and air quality sensors', status: 'LOADED', type: 'DRIVER' }],
      ['ai_cog', { id: 'ai_cog', name: 'Cognitive Assistant (Gemini)', version: '3.0.0', description: 'Natural language processing unit', status: 'LOADED', type: 'USERLAND' }],
    ]);
    this.eventLog = [];
  }

  /**
   * List all registered kernel modules
   */
  getModules(): KernelModule[] {
    return Array.from(this.modules.values());
  }

  /**
   * Load a kernel module into memory
   */
  loadModule(id: string): boolean {
    const mod = this.modules.get(id);
    if (mod) {
      mod.status = 'LOADED';
      this.log(`Kernel: Loaded module [${mod.name}]`);
      return true;
    }
    return false;
  }

  /**
   * Unload a kernel module from memory
   */
  unloadModule(id: string): boolean {
     const mod = this.modules.get(id);
    if (mod) {
      mod.status = 'UNLOADED';
      this.log(`Kernel: Unloaded module [${mod.name}]`);
      return true;
    }
    return false;
  }

  /**
   * Send a message signal to a specific module (Inter-Process Communication)
   */
  sendMessage(targetId: string, message: string): string {
    const mod = this.modules.get(targetId);
    
    if (!mod) {
      throw new Error(`Kernel Panic: Module ${targetId} not found`);
    }

    if (mod.status !== 'LOADED') {
      throw new Error(`Kernel Error: Module ${targetId} is not loaded`);
    }

    // Simulation of IPC
    this.log(`IPC: Signal sent to ${targetId}`);
    return `ACK from ${mod.name}: Received "${message.substring(0, 15)}..."`;
  }

  private log(msg: string) {
    const entry = `[${new Date().toISOString()}] ${msg}`;
    this.eventLog.push(entry);
    if (this.eventLog.length > 50) this.eventLog.shift();
  }

  getLogs(): string[] {
    return [...this.eventLog];
  }
}

export const kernel = new KernelService();
