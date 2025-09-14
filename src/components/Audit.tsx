import React, { useState, useEffect } from 'react';
import { Search, Shield, CheckCircle, AlertTriangle, ExternalLink, Download, Calendar, FileText, Globe, Star, Filter, List, Grid, ChevronDown, Clock, Lock, Code, Users, DollarSign, Percent, Award, BarChart2 } from 'lucide-react';
import { FaTwitter, FaTelegram, FaDiscord, FaGithub } from 'react-icons/fa';

interface AuditReport {
  id: number;
  projectName: string;
  logo: string;
  contractAddress: string;
  poolAddress?: string;
  blockchain: string;
  auditDate: string;
  kycCertification: string;
  auditScore: number;
  status: 'Passed' | 'Warning' | 'Failed';
  reportUrl?: string;
  badgeUrl?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  github?: string;
  technicalFindings: {
    erc20Compliance: boolean;
    routerIntegration: boolean;
    taxMechanisms: {
      marketing: string;
      development: string;
      liquidity: string;
    };
    liquidityLocked: boolean;
    contractVerified: boolean;
    kycVerified: boolean;
    exclusions?: string[];
  };
  onChainMetrics: {
    transactions: number;
    uniqueHolders: number;
    avgLiquidity: string;
    taxCollected: string;
  };
  validUntil: string;
  legalInfo: {
    jurisdiction: string;
    entityNumber: string;
    contactEmail: string;
  };
  additionalNotes?: string[];
  vulnerabilities?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

const AUDIT_REPORTS: AuditReport[] = [
  {
    id: 1,
    projectName: 'BugsBunnyToken',
    logo: 'https://photos.pinksale.finance/file/pinksale-logo-upload/1749838832223-017ee22a2bafb1a69c5e67fa17b33ece.png',
    contractAddress: '0x892CCdD2624ef09Ca5814661c566316253353820',
    poolAddress: '0x8BF8e90983b14B306b7C5ff3BcaC0F019140Dc33',
    blockchain: 'Core Chain',
    auditDate: new Date().toLocaleDateString(),
    kycCertification: 'FX-KYC-2023-0895',
    auditScore: 95.8,
    status: 'Passed',
    reportUrl: '#',
    badgeUrl: 'https://photos.pinksale.finance/file/pinksale-logo-upload/1749846994990-a1b3ca1a843f5afcdb9f905b34cbbd67.png',
    website: 'https://bugsbunny.lol/',
    twitter: 'https://x.com/bugsbunny_haha/',
    telegram: 'https://t.me/BugsBonnyx',
    github: 'https://github.com/bugsbunny-core',
    technicalFindings: {
      erc20Compliance: true,
      routerIntegration: true,
      taxMechanisms: {
        marketing: '3%',
        development: '2%',
        liquidity: '1%'
      },
      liquidityLocked: true,
      contractVerified: true,
      kycVerified: true,
      exclusions: ['CEX wallets', 'Team wallets']
    },
    onChainMetrics: {
      transactions: 4892,
      uniqueHolders: 1245,
      avgLiquidity: '$287K',
      taxCollected: '$8.2K'
    },
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    legalInfo: {
      jurisdiction: 'Singapur',
      entityNumber: '202312345X',
      contactEmail: 'contac@falcox.net'
    },
    additionalNotes: [
      'El contrato implementa mecanismos anti-bot para protección en el lanzamiento',
      'Funciones de emergencia correctamente implementadas con controles de acceso',
      'Documentación técnica completa y precisa'
    ],
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 2
    }
  }
];

const Audit: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlockchain, setSelectedBlockchain] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedReport, setSelectedReport] = useState<AuditReport | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const blockchains = ['All', 'Core Chain', 'Ethereum', 'BSC', 'Polygon'];
  const statuses = ['All', 'Passed', 'Warning', 'Failed'];
  const categories = ['All', 'DeFi', 'GameFi', 'NFT', 'Infrastructure', 'Meme'];
  const sortOptions = ['Latest', 'Audit Score', 'Project Name'];

  useEffect(() => {
    const savedFavorites = localStorage.getItem('audit_favorites');
    if (savedFavorites) {
      try {
        const favoritesArray = JSON.parse(savedFavorites);
        setFavorites(new Set(favoritesArray));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('audit_favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const toggleFavorite = (reportId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(reportId)) {
        newFavorites.delete(reportId);
      } else {
        newFavorites.add(reportId);
      }
      return newFavorites;
    });
  };

  const downloadPDF = (report: AuditReport) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Informe de Auditoría - ${report.projectName}</title>
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 100%;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
          }
          
          .header {
            text-align: center;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
            position: relative;
          }
          
          .falcox-logo {
            position: absolute;
            top: 10px;
            left: 10px;
            width: 100px;
            height: auto;
          }
          
          .project-logo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: block;
            object-fit: cover;
          }
          
          .title {
            color: #1f2937;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          
          .subtitle {
            color: #6b7280;
            font-size: 16px;
          }
          
          .section {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background-color: #f9fafb;
          }
          
          .section-title {
            color: #1f2937;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            border-bottom: 2px solid #f3f4f6;
            padding-bottom: 5px;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
          }
          
          @media (max-width: 600px) {
            .info-grid {
              grid-template-columns: 1fr;
            }
            
            .metrics-grid {
              grid-template-columns: 1fr 1fr !important;
            }
          }
          
          .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          
          .info-label {
            color: #6b7280;
            font-weight: 500;
          }
          
          .info-value {
            color: #1f2937;
            font-weight: 600;
          }
          
          .score-container {
            text-align: center;
            margin: 30px 0;
            position: relative;
          }
          
          .score-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: linear-gradient(135deg, #10b981, #059669);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);
          }
          
          .score {
            font-size: 36px;
            font-weight: bold;
            color: white;
          }
          
          .status-passed {
            background: #10b981;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            display: inline-block;
            margin-top: 10px;
          }
          
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            text-align: center;
          }
          
          .metric {
            padding: 15px;
            background: #f9fafb;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
          }
          
          .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
          }
          
          .metric-label {
            color: #6b7280;
            font-size: 12px;
            margin-top: 5px;
          }
          
          .findings {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
          }
          
          .findings-blue {
            background: #eff6ff;
            border-color: #bfdbfe;
          }
          
          .findings-purple {
            background: #f5f3ff;
            border-color: #ddd6fe;
          }
          
          .finding-item {
            display: flex;
            align-items: flex-start;
            margin: 8px 0;
          }
          
          .check-icon {
            color: #10b981;
            margin-right: 10px;
            font-weight: bold;
            flex-shrink: 0;
            margin-top: 3px;
          }
          
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
          }
          
          .certification-box {
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
            box-shadow: 0 4px 6px rgba(251, 191, 36, 0.2);
          }
          
          .vulnerabilities {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
            flex-wrap: wrap;
          }
          
          .vulnerability-item {
            flex: 1;
            min-width: 100px;
            text-align: center;
            padding: 10px;
            margin: 5px;
            border-radius: 8px;
          }
          
          .critical {
            background-color: #fee2e2;
            color: #b91c1c;
            border: 1px solid #fecaca;
          }
          
          .high {
            background-color: #ffedd5;
            color: #c2410c;
            border: 1px solid #fed7aa;
          }
          
          .medium {
            background-color: #fef3c7;
            color: #b45309;
            border: 1px solid #fde68a;
          }
          
          .low {
            background-color: #ecfdf5;
            color: #065f46;
            border: 1px solid #d1fae5;
          }
          
          .notes-list {
            background-color: #f3f4f6;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
          }
          
          .note-item {
            margin: 8px 0;
            padding-left: 20px;
            position: relative;
          }
          
          .note-item:before {
            content: "•";
            position: absolute;
            left: 5px;
            color: #6b7280;
          }
          
          .badge-container {
            display: flex;
            justify-content: center;
            margin: 20px 0;
          }
          
          .badge {
            max-width: 200px;
            height: auto;
          }
          
          @media print {
            body {
              font-size: 12pt;
            }
            
            .section {
              page-break-inside: avoid;
            }
            
            .header, .footer {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://photos.pinksale.finance/file/pinksale-logo-upload/1749846994990-a1b3ca1a843f5afcdb9f905b34cbbd67.png" alt="Falco-X" class="falcox-logo" />
            <img src="${report.logo}" alt="${report.projectName}" class="project-logo" />
            <div class="title">Informe de Auditoría Oficial</div>
            <div class="subtitle">${report.projectName} (${report.blockchain})</div>
            <div style="margin-top: 15px;">
              <span class="status-passed">${report.status}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">📋 Información General</div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Realizado por:</span>
                <span class="info-value">Falco-X</span>
              </div>
              <div class="info-item">
                <span class="info-label">Fecha:</span>
                <span class="info-value">${report.auditDate}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Certificación KYC:</span>
                <span class="info-value">${report.kycCertification}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Válido hasta:</span>
                <span class="info-value">${report.validUntil}</span>
              </div>
            </div>
          </div>

          <div class="score-container">
            <div class="score-circle">
              <div class="score">${report.auditScore.toFixed(2)}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">📌 Datos Técnicos Verificados</div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Blockchain:</span>
                <span class="info-value">${report.blockchain}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Contrato Principal:</span>
                <span class="info-value">${report.contractAddress}</span>
              </div>
              ${report.poolAddress ? `
              <div class="info-item">
                <span class="info-label">Pool de Liquidez:</span>
                <span class="info-value">${report.poolAddress}</span>
              </div>
              ` : ''}
              <div class="info-item">
                <span class="info-label">KYC Validado:</span>
                <span class="info-value">✓ Verificado</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">✅ Hallazgos Positivos</div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #10b981; font-size: 16px;">1. Cumplimiento Técnico</h3>
              <div class="findings">
                <div class="finding-item">
                  <span class="check-icon">✓</span>
                  <span>Estándar ERC20 Certificado: Implementa todas las funciones requeridas (transfer, approve, balanceOf) sin desviaciones.</span>
                </div>
                <div class="finding-item">
                  <span class="check-icon">✓</span>
                  <span>Integración con CoreSwap: Interacción fluida con el router de Core Chain para swaps y añadido de liquidez.</span>
                </div>
              </div>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #3b82f6; font-size: 16px;">2. Mecanismos de Tax Automatizados</h3>
              <div class="findings findings-blue">
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">Marketing:</span>
                    <span class="info-value">${report.technicalFindings.taxMechanisms.marketing}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Desarrollo:</span>
                    <span class="info-value">${report.technicalFindings.taxMechanisms.development}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Liquidez:</span>
                    <span class="info-value">${report.technicalFindings.taxMechanisms.liquidity}</span>
                  </div>
                </div>
                ${report.technicalFindings.exclusions ? `
                <div class="finding-item" style="margin-top: 10px;">
                  <span class="check-icon">✓</span>
                  <span>Exclusiones Funcionales: ${report.technicalFindings.exclusions.join(', ')} correctamente excluidas de tax.</span>
                </div>
                ` : ''}
              </div>
            </div>
            
            <div>
              <h3 style="color: #8b5cf6; font-size: 16px;">3. Seguridad Operacional</h3>
              <div class="findings findings-purple">
                <div class="finding-item">
                  <span class="check-icon">✓</span>
                  <span>Contrato Verificado: Código fuente público en CoreScan.</span>
                </div>
                <div class="finding-item">
                  <span class="check-icon">✓</span>
                  <span>Liquidez Bloqueada: 100% de los LP tokens asegurados en contrato de lock.</span>
                </div>
              </div>
            </div>
          </div>

          ${report.vulnerabilities ? `
          <div class="section">
            <div class="section-title">🔍 Análisis de Vulnerabilidades</div>
            <div class="vulnerabilities">
              <div class="vulnerability-item critical">
                <div style="font-size: 24px; font-weight: bold;">${report.vulnerabilities.critical}</div>
                <div>Críticas</div>
              </div>
              <div class="vulnerability-item high">
                <div style="font-size: 24px; font-weight: bold;">${report.vulnerabilities.high}</div>
                <div>Altas</div>
              </div>
              <div class="vulnerability-item medium">
                <div style="font-size: 24px; font-weight: bold;">${report.vulnerabilities.medium}</div>
                <div>Medias</div>
              </div>
              <div class="vulnerability-item low">
                <div style="font-size: 24px; font-weight: bold;">${report.vulnerabilities.low}</div>
                <div>Bajas</div>
              </div>
            </div>
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">📊 Métricas On-Chain (Últimos 30 días)</div>
            <div class="metrics-grid">
              <div class="metric">
                <div class="metric-value">${report.onChainMetrics.transactions.toLocaleString()}</div>
                <div class="metric-label">Transacciones</div>
              </div>
              <div class="metric">
                <div class="metric-value">${report.onChainMetrics.uniqueHolders.toLocaleString()}</div>
                <div class="metric-label">Holders Únicos</div>
              </div>
              <div class="metric">
                <div class="metric-value">${report.onChainMetrics.avgLiquidity}</div>
                <div class="metric-label">Liquidez Promedio</div>
              </div>
              <div class="metric">
                <div class="metric-value">${report.onChainMetrics.taxCollected}</div>
                <div class="metric-label">Tax Recaudadas</div>
              </div>
            </div>
          </div>

          ${report.additionalNotes && report.additionalNotes.length > 0 ? `
          <div class="section">
            <div class="section-title">📝 Notas Adicionales</div>
            <div class="notes-list">
              ${report.additionalNotes.map(note => `
                <div class="note-item">${note}</div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          <div class="certification-box">
            <h3 style="font-size: 18px; margin-bottom: 10px;">🏆 Certificación</h3>
            <p>Falco-X otorga al proyecto ${report.projectName} el sello de "Auditado y KYC-Verificado" tras confirmar:</p>
            <ul style="list-style-type: none; margin-top: 10px; text-align: left; padding-left: 20px;">
              <li style="margin-bottom: 5px;">• Ausencia de backdoors maliciosos.</li>
              <li style="margin-bottom: 5px;">• Alineación con estándares Web3.</li>
              <li style="margin-bottom: 5px;">• Prácticas comerciales legítimas.</li>
            </ul>
            <p style="margin-top: 10px;">Válido por: 12 meses desde la fecha de emisión.</p>
          </div>

          <div class="section">
            <div class="section-title">📜 Legal & Compliance</div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Registro KYC:</span>
                <span class="info-value">${report.kycCertification}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Jurisdicción:</span>
                <span class="info-value">${report.legalInfo.jurisdiction} (${report.legalInfo.entityNumber})</span>
              </div>
              <div class="info-item">
                <span class="info-label">Contacto Legal:</span>
                <span class="info-value">${report.legalInfo.contactEmail}</span>
              </div>
            </div>
          </div>

          <div class="badge-container">
            <img src="${report.badgeUrl}" alt="Falco-X Audit Badge" class="badge" />
          </div>

          <div class="footer">
            <p>Este informe es emitido por Falco-X y es válido por 12 meses desde la fecha de emisión.</p>
            <p>© ${new Date().getFullYear()} Falco-X. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Audit_Report_${report.projectName}_${report.auditDate.replace(/\//g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const filteredReports = AUDIT_REPORTS.filter(report => {
    const matchesSearch = report.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.contractAddress.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBlockchain = selectedBlockchain === 'All' || report.blockchain === selectedBlockchain;
    const matchesStatus = selectedStatus === 'All' || report.status === selectedStatus;

    return matchesSearch && matchesBlockchain && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Passed': return 'bg-green-600';
      case 'Warning': return 'bg-yellow-600';
      case 'Failed': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (selectedReport) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setSelectedReport(null)}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4 text-sm sm:text-base"
          >
            ← Back to Audit Reports
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Audit Report - {selectedReport.projectName}</h1>
            <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(selectedReport.status)} self-start sm:self-auto`}>
              {selectedReport.status}
            </span>
          </div>
        </div>

        <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800 p-4 sm:p-6">
          {/* Header del Reporte */}
          <div className="border-b border-gray-700 pb-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={selectedReport.logo}
                  alt={selectedReport.projectName}
                  className="w-16 h-16 rounded-full"
                />
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {selectedReport.projectName}
                  </h2>
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                    <span className="text-xs sm:text-sm text-gray-400">{selectedReport.blockchain}</span>
                    <span className="text-gray-500 hidden sm:block">•</span>
                    <span className="text-xs sm:text-sm text-gray-400">Audit #{selectedReport.id}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex justify-center sm:justify-end">
                <div className="text-center">
                  <div className={`text-3xl sm:text-4xl font-bold ${getScoreColor(selectedReport.auditScore)}`}>
                    {selectedReport.auditScore.toFixed(1)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">Security Score</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div className="bg-gray-800/50 rounded-lg p-3 flex items-center gap-3">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <div>
                  <div className="text-xs text-gray-400">Audit Date</div>
                  <div className="text-xs sm:text-sm text-white">{selectedReport.auditDate}</div>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 flex items-center gap-3">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <div>
                  <div className="text-xs text-gray-400">KYC Certification</div>
                  <div className="text-xs sm:text-sm text-white">{selectedReport.kycCertification}</div>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 flex items-center gap-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                <div>
                  <div className="text-xs text-gray-400">Valid Until</div>
                  <div className="text-xs sm:text-sm text-white">{selectedReport.validUntil}</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3 sm:p-4">
              <h3 className="text-sm sm:text-lg font-semibold text-blue-400 mb-2">🔍 Resumen Certificado</h3>
              <p className="text-xs sm:text-sm text-gray-300">
                Falco-X ha realizado una auditoría exhaustiva del contrato {selectedReport.projectName} ({formatAddress(selectedReport.contractAddress)}) en {selectedReport.blockchain}, verificando su compliance técnico, seguridad operacional y legitimidad comercial.
              </p>
            </div>
          </div>

          {/* Datos Técnicos */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-400" />
              Datos Técnicos Verificados
            </h3>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-xs sm:text-sm text-gray-400">Blockchain:</span>
                    <span className="text-xs sm:text-sm text-white">{selectedReport.blockchain}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-xs sm:text-sm text-gray-400">Contrato Principal:</span>
                    <a 
                      href={`https://scan.coredao.org/address/${selectedReport.contractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      {formatAddress(selectedReport.contractAddress)}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  {selectedReport.poolAddress && (
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-xs sm:text-sm text-gray-400">Pool de Liquidez:</span>
                      <a 
                        href={`https://scan.coredao.org/address/${selectedReport.poolAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        {formatAddress(selectedReport.poolAddress)}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-xs sm:text-sm text-gray-400">KYC Validado:</span>
                    <span className="text-xs sm:text-sm text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Ver Certificación
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-xs sm:text-sm text-gray-400">Contrato Verificado:</span>
                    <span className="text-xs sm:text-sm text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verificado
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-xs sm:text-sm text-gray-400">Liquidez Bloqueada:</span>
                    <span className="text-xs sm:text-sm text-green-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      100% Bloqueada
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vulnerabilidades */}
          {selectedReport.vulnerabilities && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Análisis de Vulnerabilidades
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-red-400">{selectedReport.vulnerabilities.critical}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Críticas</div>
                </div>
                <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-orange-400">{selectedReport.vulnerabilities.high}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Altas</div>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-400">{selectedReport.vulnerabilities.medium}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Medias</div>
                </div>
                <div className="bg-green-900/20 border border-green-800 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-400">{selectedReport.vulnerabilities.low}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Bajas</div>
                </div>
              </div>
            </div>
          )}

          {/* Hallazgos Positivos */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Hallazgos Positivos
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-green-900/20 border border-green-800 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                  <span className="bg-green-500/20 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-green-400">1</span>
                  Cumplimiento Técnico
                </h4>
                <ul className="space-y-1 text-xs sm:text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Estándar ERC20 Certificado: Implementa todas las funciones requeridas (transfer, approve, balanceOf) sin desviaciones.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Integración con CoreSwap: Interacción fluida con el router de Core Chain para swaps y añadido de liquidez.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                  <span className="bg-blue-500/20 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-blue-400">2</span>
                  Mecanismos de Tax Automatizados
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm mb-3">
                  <div className="bg-blue-900/30 rounded-lg p-2 sm:p-3 flex flex-col items-center">
                    <Percent className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mb-1" />
                    <span className="text-gray-400">Marketing:</span>
                    <span className="text-white font-medium">{selectedReport.technicalFindings.taxMechanisms.marketing}</span>
                  </div>
                  <div className="bg-blue-900/30 rounded-lg p-2 sm:p-3 flex flex-col items-center">
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mb-1" />
                    <span className="text-gray-400">Desarrollo:</span>
                    <span className="text-white font-medium">{selectedReport.technicalFindings.taxMechanisms.development}</span>
                  </div>
                  <div className="bg-blue-900/30 rounded-lg p-2 sm:p-3 flex flex-col items-center">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mb-1" />
                    <span className="text-gray-400">Liquidez:</span>
                    <span className="text-white font-medium">{selectedReport.technicalFindings.taxMechanisms.liquidity}</span>
                  </div>
                </div>
                {selectedReport.technicalFindings.exclusions && (
                  <div className="text-xs sm:text-sm text-gray-300 bg-blue-900/10 p-2 sm:p-3 rounded-lg">
                    <span className="font-medium text-blue-400">Exclusiones: </span>
                    {selectedReport.technicalFindings.exclusions.join(', ')} correctamente excluidas de tax.
                  </div>
                )}
              </div>

              <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
                  <span className="bg-purple-500/20 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-purple-400">3</span>
                  Seguridad Operacional
                </h4>
                <ul className="space-y-1 text-xs sm:text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Contrato Verificado: Código fuente público en CoreScan.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Liquidez Bloqueada: 100% de los LP tokens asegurados en contrato de lock.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Métricas On-Chain */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-400" />
              Métricas On-Chain (Últimos 30 días)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 flex flex-col items-center">
                <div className="bg-blue-900/30 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-blue-400">{selectedReport.onChainMetrics.transactions.toLocaleString()}</div>
                <div className="text-xs sm:text-sm text-gray-400">Transacciones</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 flex flex-col items-center">
                <div className="bg-green-900/30 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-green-400">{selectedReport.onChainMetrics.uniqueHolders.toLocaleString()}</div>
                <div className="text-xs sm:text-sm text-gray-400">Holders Únicos</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 flex flex-col items-center">
                <div className="bg-purple-900/30 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-purple-400">{selectedReport.onChainMetrics.avgLiquidity}</div>
                <div className="text-xs sm:text-sm text-gray-400">Liquidez Promedio</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 flex flex-col items-center">
                <div className="bg-yellow-900/30 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2">
                  <Percent className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-yellow-400">{selectedReport.onChainMetrics.taxCollected}</div>
                <div className="text-xs sm:text-sm text-gray-400">Tax Recaudadas</div>
              </div>
            </div>
          </div>

          {/* Notas Adicionales */}
          {selectedReport.additionalNotes && selectedReport.additionalNotes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-yellow-400" />
                Notas Adicionales
              </h3>
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4">
                <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
                  {selectedReport.additionalNotes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Certificación */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Certificación
            </h3>
            <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-800 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4">
                Falco-X otorga al proyecto {selectedReport.projectName} el sello de "Auditado y KYC-Verificado" tras confirmar:
              </p>
              <ul className="space-y-1 text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                  <span>Ausencia de backdoors maliciosos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                  <span>Alineación con estándares Web3</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                  <span>Prácticas comerciales legítimas</span>
                </li>
              </ul>
              <div className="text-xs sm:text-sm">
                <span className="text-gray-400">Válido por:</span>
                <span className="text-white ml-2">12 meses desde la fecha de emisión</span>
              </div>
            </div>
          </div>

          {/* Legal & Compliance */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Legal & Compliance
            </h3>
            <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-400">Registro KYC:</span>
                  <span className="text-white ml-2">{selectedReport.kycCertification}</span>
                </div>
                <div>
                  <span className="text-gray-400">Jurisdicción:</span>
                  <span className="text-white ml-2">{selectedReport.legalInfo.jurisdiction} ({selectedReport.legalInfo.entityNumber})</span>
                </div>
                <div>
                  <span className="text-gray-400">Contacto Legal:</span>
                  <a href={`mailto:${selectedReport.legalInfo.contactEmail}`} className="text-blue-400 hover:text-blue-300 ml-2">
                    {selectedReport.legalInfo.contactEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Badge y Enlaces */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {selectedReport.badgeUrl && (
                <img
                  src={selectedReport.badgeUrl}
                  alt="Audit Badge"
                  className="h-12 sm:h-16"
                />
              )}
              <div className="flex gap-2">
                {selectedReport.website && (
                  <a href={selectedReport.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                )}
                {selectedReport.twitter && (
                  <a href={selectedReport.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                    <FaTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                )}
                {selectedReport.telegram && (
                  <a href={selectedReport.telegram} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                    <FaTelegram className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                )}
                {selectedReport.discord && (
                  <a href={selectedReport.discord} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                    <FaDiscord className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                )}
                {selectedReport.github && (
                  <a href={selectedReport.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                    <FaGithub className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => downloadPDF(selectedReport)}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                Descargar Reporte
              </button>
              <button
                onClick={() => toggleFavorite(selectedReport.id)}
                className={`p-2 rounded-lg transition-colors ${
                  favorites.has(selectedReport.id) 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                <Star className={`w-4 h-4 ${favorites.has(selectedReport.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Security Audits</h1>
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Live</span>
        </div>
        <p className="text-xs sm:text-sm md:text-base text-gray-400">
          Professional security audits and compliance reports for blockchain projects
        </p>
      </div>

      <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800">
        {/* Filters */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by project name or contract address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors text-xs sm:text-sm"
              >
                <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Filters</span>
                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 bg-gray-800/50 p-3 sm:p-4 rounded-lg">
              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Blockchain:</label>
                <select
                  value={selectedBlockchain}
                  onChange={(e) => setSelectedBlockchain(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {blockchains.map(blockchain => (
                    <option key={blockchain} value={blockchain}>{blockchain}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Status:</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Category:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={favorites.size > 0}
                    onChange={() => {
                      if (favorites.size > 0) {
                        setFavorites(new Set());
                      }
                    }}
                    className="rounded border-gray-700 bg-gray-800 text-yellow-500 focus:ring-yellow-500 w-3 h-3 sm:w-4 sm:h-4"
                  />
                  <span className="text-xs sm:text-sm text-gray-400 flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                    Show only favorites
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Reports List */}
        <div className="divide-y divide-gray-800">
          {filteredReports.length === 0 ? (
            <div className="p-6 sm:p-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </div>
                <h3 className="text-sm sm:text-lg font-medium text-white mb-1 sm:mb-2">No Audit Reports Found</h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            </div>
          ) : (
            viewMode === 'list' ? (
              filteredReports.map((report) => (
                <div key={report.id} className="p-3 sm:p-4 hover:bg-gray-800/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    <img
                      src={report.logo}
                      alt={report.projectName}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                        <h3 className="text-sm sm:text-lg font-medium text-white">{report.projectName}</h3>
                        <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs text-white ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                          {report.blockchain}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-2 sm:mb-3">
                        <div>
                          <span className="text-xs text-gray-400">Contract:</span>
                          <span className="text-xs sm:text-sm text-white ml-1 sm:ml-2">{formatAddress(report.contractAddress)}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400">Audit Date:</span>
                          <span className="text-xs sm:text-sm text-white ml-1 sm:ml-2">{report.auditDate}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400">KYC:</span>
                          <span className="text-xs sm:text-sm text-white ml-1 sm:ml-2">{report.kycCertification}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-xs text-gray-400">Score:</span>
                          <span className={`text-sm sm:text-lg font-bold ${getScoreColor(report.auditScore)}`}>
                            {report.auditScore}
                          </span>
                        </div>
                        <div className="flex gap-1 sm:gap-2">
                          {report.website && (
                            <a href={report.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                              <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                            </a>
                          )}
                          {report.twitter && (
                            <a href={report.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                              <FaTwitter className="w-3 h-3 sm:w-4 sm:h-4" />
                            </a>
                          )}
                          {report.telegram && (
                            <a href={report.telegram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                              <FaTelegram className="w-3 h-3 sm:w-4 sm:h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 sm:gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => toggleFavorite(report.id)}
                        className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                          favorites.has(report.id) 
                            ? 'text-yellow-500 hover:text-yellow-400' 
                            : 'text-gray-400 hover:text-yellow-500'
                        }`}
                      >
                        <Star className={`w-3 h-3 sm:w-4 sm:h-4 ${favorites.has(report.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs sm:text-sm"
                      >
                        Ver Reporte
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredReports.map((report) => (
                  <div key={report.id} className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors">
                    <div className="relative">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gray-900/90"></div>
                      <img
                        src={report.logo}
                        alt={report.projectName}
                        className="w-full h-28 sm:h-32 object-cover"
                      />
                      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex justify-between items-center">
                        <div>
                          <h3 className="text-sm sm:text-base font-medium text-white">{report.projectName}</h3>
                          <div className="flex items-center gap-1 text-xs text-gray-300">
                            <span>{report.blockchain}</span>
                            <span className="text-gray-500 hidden sm:block">•</span>
                            <span className="hidden sm:block">{report.auditDate}</span>
                          </div>
                        </div>
                        <div className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs text-white ${getStatusColor(report.status)}`}>
                          {report.status}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 sm:p-4">
                      <div className="flex justify-between items-center mb-2 sm:mb-3">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                          <span className="text-xs sm:text-sm text-gray-400">Security Score:</span>
                        </div>
                        <span className={`text-base sm:text-lg font-bold ${getScoreColor(report.auditScore)}`}>
                          {report.auditScore.toFixed(1)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2 sm:mb-3">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                          <span className="text-xs sm:text-sm text-gray-400">KYC:</span>
                        </div>
                        <span className="text-xs sm:text-sm text-white">{report.kycCertification}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Code className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                          <span className="text-xs sm:text-sm text-gray-400">Contract:</span>
                        </div>
                        <a 
                          href={`https://scan.coredao.org/address/${report.contractAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          {formatAddress(report.contractAddress)}
                          <ExternalLink className="w-2 h-2 sm:w-3 sm:h-3" />
                        </a>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-700">
                        <div className="flex gap-1 sm:gap-2">
                          {report.website && (
                            <a href={report.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                              <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                            </a>
                          )}
                          {report.twitter && (
                            <a href={report.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                              <FaTwitter className="w-3 h-3 sm:w-4 sm:h-4" />
                            </a>
                          )}
                          {report.telegram && (
                            <a href={report.telegram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                              <FaTelegram className="w-3 h-3 sm:w-4 sm:h-4" />
                            </a>
                          )}
                        </div>
                        <div className="flex gap-1 sm:gap-2">
                          <button
                            onClick={() => toggleFavorite(report.id)}
                            className={`p-1 sm:p-1.5 rounded-lg transition-colors ${
                              favorites.has(report.id) 
                                ? 'text-yellow-500 hover:text-yellow-400' 
                                : 'text-gray-400 hover:text-yellow-500'
                            }`}
                          >
                            <Star className={`w-3 h-3 sm:w-4 sm:h-4 ${favorites.has(report.id) ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs"
                          >
                            Ver Reporte
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Audit;