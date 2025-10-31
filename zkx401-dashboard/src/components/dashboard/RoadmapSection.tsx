import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Target, 
  Rocket,
  Code,
  Shield,
  Zap,
  Users,
  Database,
  Globe,
  Star,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface RoadmapItem {
  id: string;
  quarter: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  tasks: string[];
  icon: React.ReactNode;
  color: string;
}

const roadmapItems: RoadmapItem[] = [
  {
    id: 'q3-2024',
    quarter: 'Q3 2024',
    title: 'Foundation & Core Protocol',
    description: 'Membangun fondasi teknologi ZKx401 dengan core protocol development',
    status: 'completed',
    tasks: [
      'Arkworks integration untuk Groth16',
      'Basic ZK proof generation system',
      'Solana integration layer',
      'Core circuit development',
      'Initial testing framework'
    ],
    icon: <Code className="w-6 h-6" />,
    color: 'from-accent-green to-emerald-500'
  },
  {
    id: 'q4-2024',
    quarter: 'Q4 2024',
    title: 'x402 Payment Routing & Testnet Launch',
    description: 'Peluncuran sistem x402 payment routing dengan testnet environment',
    status: 'in-progress',
    tasks: [
      'x402 routing protocol implementation',
      'Privacy-first transaction routing',
      'Testnet deployment on Solana',
      'Zero-knowledge proof verification',
      'Developer documentation',
      'API endpoints untuk integrasi',
      'Performance optimization',
      'Security audit preparation'
    ],
    icon: <Zap className="w-6 h-6" />,
    color: 'from-accent-cyan to-blue-500'
  },
  {
    id: 'q1-2025',
    quarter: 'Q1 2025',
    title: 'Mainnet Launch & Ecosystem',
    description: 'Peluncuran mainnet dengan ecosystem expansion dan partner integration',
    status: 'upcoming',
    tasks: [
      'Mainnet deployment',
      'DeFi protocol integrations',
      'NFT marketplace partnerships',
      'Developer incentive program',
      'Cross-chain bridge development',
      'Advanced privacy features',
      'Governance token launch'
    ],
    icon: <Globe className="w-6 h-6" />,
    color: 'from-accent-purple to-violet-500'
  },
  {
    id: 'q2-2025',
    quarter: 'Q2 2025',
    title: 'Enterprise & Advanced Features',
    description: 'Fitur enterprise dengan advanced ZK capabilities dan institutional adoption',
    status: 'upcoming',
    tasks: [
      'Enterprise API solutions',
      'Advanced ZK-SNARK optimizations',
      'Institutional compliance features',
      'Multi-signature support',
      'Regulatory reporting tools',
      'Enterprise dashboard',
      'B2B partnership program'
    ],
    icon: <Users className="w-6 h-6" />,
    color: 'from-orange-500 to-red-500'
  }
];

const RoadmapSection: React.FC = () => {
  const [selectedQuarter, setSelectedQuarter] = useState<string>('q4-2024');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const currentItem = roadmapItems.find(item => item.id === selectedQuarter);
  const completedItems = roadmapItems.filter(item => item.status === 'completed');
  const upcomingItems = roadmapItems.filter(item => item.status === 'upcoming');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-accent-green" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-accent-cyan" />;
      default:
        return <Target className="w-5 h-5 text-text-tertiary" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'in-progress':
        return 'Dalam Progress';
      default:
        return 'Akan Datang';
    }
  };

  return (
    <section id="roadmap" className="py-20 bg-bg-near-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              className="p-3 rounded-xl bg-gradient-to-r from-accent-cyan/10 via-accent-purple/10 to-accent-green/10 border border-accent-cyan/20"
              whileHover={{ scale: 1.1 }}
            >
              <Calendar className="w-6 h-6 text-accent-cyan" />
            </motion.div>
            <div className="px-3 py-1 rounded-full bg-accent-cyan/10 text-accent-cyan text-xs font-semibold">
              DEVELOPMENT ROADMAP
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Roadmap
            <span className="bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-green bg-clip-text text-transparent">
              {' '}Pengembangan{' '}
            </span>
            ZKx401
          </h2>
          
          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
            Timeline pengembangan lengkap ZKx401 dari foundation hingga enterprise adoption. 
            Semua fitur utama akan selesai di <span className="text-accent-cyan font-semibold">Q4 2024</span>.
          </p>

          {/* Q4 Completion Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-green/20 to-accent-cyan/20 border border-accent-green/30 rounded-full"
          >
            <Rocket className="w-5 h-5 text-accent-green" />
            <span className="text-accent-green font-semibold">
              🎯 Target Penyelesaian: Q4 2024
            </span>
          </motion.div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          <div className="p-6 bg-bg-elevated rounded-xl border border-border-primary">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent-green/10">
                <CheckCircle className="w-6 h-6 text-accent-green" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Completed</h3>
                <p className="text-text-tertiary text-sm">Foundation Phase</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-accent-green mb-1">
              {completedItems.length}
            </div>
            <p className="text-text-secondary text-sm">
              Phase pengembangan selesai
            </p>
          </div>

          <div className="p-6 bg-bg-elevated rounded-xl border border-border-primary">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent-cyan/10">
                <Clock className="w-6 h-6 text-accent-cyan" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">In Progress</h3>
                <p className="text-text-tertiary text-sm">Current Quarter</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-accent-cyan mb-1">Q4</div>
            <p className="text-text-secondary text-sm">
              Core features completion
            </p>
          </div>

          <div className="p-6 bg-bg-elevated rounded-xl border border-border-primary">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent-purple/10">
                <Target className="w-6 h-6 text-accent-purple" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Upcoming</h3>
                <p className="text-text-tertiary text-sm">Future Phases</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-accent-purple mb-1">
              {upcomingItems.length}
            </div>
            <p className="text-text-secondary text-sm">
              Expansion & enterprise
            </p>
          </div>
        </motion.div>

        {/* Timeline Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-green via-accent-cyan to-accent-purple"></div>

          {/* Roadmap Items */}
          <div className="space-y-8">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Timeline Dot */}
                <div className={`absolute left-6 w-4 h-4 rounded-full border-4 ${
                  item.status === 'completed' 
                    ? 'bg-accent-green border-accent-green/20' 
                    : item.status === 'in-progress'
                    ? 'bg-accent-cyan border-accent-cyan/20 animate-pulse'
                    : 'bg-text-tertiary border-border-primary'
                }`}></div>

                {/* Content Card */}
                <div className="ml-16">
                  <motion.div
                    className={`p-6 rounded-xl border cursor-pointer transition-all ${
                      selectedQuarter === item.id
                        ? 'bg-bg-elevated border-accent-cyan shadow-glow-cyan'
                        : 'bg-bg-elevated border-border-primary hover:border-accent-cyan/50'
                    }`}
                    onClick={() => setSelectedQuarter(item.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color} bg-opacity-10`}>
                          <div className={item.status === 'completed' ? 'text-accent-green' : 
                                        item.status === 'in-progress' ? 'text-accent-cyan' : 'text-text-tertiary'}>
                            {item.icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-text-primary">{item.title}</h3>
                          <p className="text-text-tertiary text-sm">{item.quarter}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                          item.status === 'completed' ? 'bg-accent-green/10 text-accent-green' :
                          item.status === 'in-progress' ? 'bg-accent-cyan/10 text-accent-cyan' :
                          'bg-text-tertiary/10 text-text-tertiary'
                        }`}>
                          {getStatusIcon(item.status)}
                          <span className="text-sm font-medium">
                            {getStatusText(item.status)}
                          </span>
                        </div>
                        
                        <ArrowRight className={`w-4 h-4 transition-transform ${
                          selectedQuarter === item.id ? 'rotate-90 text-accent-cyan' : 'text-text-tertiary'
                        }`} />
                      </div>
                    </div>

                    <p className="text-text-secondary mb-4">{item.description}</p>

                    {/* Task List - Expanded when selected */}
                    {selectedQuarter === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3 border-t border-border-primary pt-4"
                      >
                        <h4 className="font-semibold text-text-primary mb-3">Key Deliverables:</h4>
                        {item.tasks.map((task, taskIndex) => (
                          <motion.div
                            key={taskIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: taskIndex * 0.05 }}
                            className="flex items-center gap-3"
                          >
                            <div className="w-2 h-2 rounded-full bg-accent-cyan"></div>
                            <span className="text-text-secondary">{task}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Current Focus Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-gradient-to-r from-accent-cyan/10 via-accent-purple/10 to-accent-green/10 rounded-xl border border-accent-cyan/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              className="p-3 rounded-lg bg-accent-cyan/20"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <TrendingUp className="w-6 h-6 text-accent-cyan" />
            </motion.div>
            <h3 className="text-2xl font-bold text-text-primary">Focus Saat Ini</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-4">
                Q4 2024 - Core Development
              </h4>
              <p className="text-text-secondary mb-6">
                Saat ini tim pengembangan fokus menyelesaikan implementasi x402 routing protocol 
                dan mempersiapkan testnet launch dengan semua fitur privacy-first.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-cyan animate-pulse"></div>
                  <span className="text-text-secondary">Performance optimization</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-cyan animate-pulse"></div>
                  <span className="text-text-secondary">Security audit preparation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-cyan animate-pulse"></div>
                  <span className="text-text-secondary">Developer documentation</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-cyan mb-2">Q4 2024</div>
                <p className="text-text-tertiary mb-4">Target Completion</p>
                <div className="flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 text-accent-green" />
                  <span className="text-accent-green font-semibold">Production Ready</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RoadmapSection;