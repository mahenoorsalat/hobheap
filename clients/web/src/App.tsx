import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  FileText, 
  Image, 
  Code, 
  Database,
  Settings,
  Home,
  Inbox,
  Users,
  Star,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Trash2,
  Edit,
  Link,
  Tag,
  CheckSquare,
  BookOpen,
  Activity,
  Target,
  Brain,
  Network,
  Zap,
  Clock,
  Menu,
  X
} from 'lucide-react';

interface Card {
  id: number;
  title: string;
  type: 'text' | 'image' | 'code';
  content: string;
  tags: string[];
  lastModified: string;
  embeddings?: boolean;
  dependencies?: number[];
  metadata?: Record<string, any>;
}

interface SidebarItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const App: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [cards, setCards] = useState<Card[]>([
    {
      id: 1,
      title: 'Recipe - Chocolate Chip Cookie',
      type: 'text',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eget mauris eget lorem faucibus dignissim. This recipe includes step-by-step instructions for making delicious chocolate chip cookies.',
      tags: ['recipe', 'dessert', 'baking'],
      lastModified: '2 hours ago',
      embeddings: true,
      dependencies: [2],
      metadata: { category: 'cooking', difficulty: 'easy' }
    },
    {
      id: 2,
      title: 'Best Hiking Trails',
      type: 'text', 
      content: 'Great trails for outdoor adventures. Mountain views and scenic routes. Perfect for weekend getaways and nature photography.',
      tags: ['outdoor', 'hiking', 'nature'],
      lastModified: '1 day ago',
      embeddings: true,
      dependencies: [],
      metadata: { location: 'mountain', season: 'summer' }
    },
    {
      id: 3,
      title: 'Journey - Trip to Grand Canyon',
      type: 'text',
      content: 'An amazing journey through the desert landscapes and canyon views. Documentation of a 5-day adventure with photos and experiences.',
      tags: ['travel', 'journey', 'canyon'],
      lastModified: '3 days ago',
      embeddings: false,
      dependencies: [2],
      metadata: { duration: '5 days', cost: 1200 }
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showNewCardDialog, setShowNewCardDialog] = useState<boolean>(false);
  const [newCardType, setNewCardType] = useState<'text' | 'image' | 'code'>('text');
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isGeneratingEmbeddings, setIsGeneratingEmbeddings] = useState<boolean>(false);

  // Check if device is mobile/tablet
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarExpanded(true);
        setSidebarOpen(false);
      } else {
        setSidebarExpanded(true);
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const cardTypes: { id: 'text' | 'image' | 'code'; name: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'text', name: 'Text', icon: FileText },
    { id: 'image', name: 'Images/Graphs', icon: Image },
    { id: 'code', name: 'CAD, etc', icon: Code }
  ];

  const sidebarItems: SidebarItem[] = [
    { id: 'search', name: 'Search', icon: Search },
    { id: 'home', name: 'Home', icon: Home },
    { id: 'inbox', name: 'Inbox', icon: Inbox },
  ];

  const privateItems: SidebarItem[] = [
    { id: 'personal', name: 'Personal Home', icon: Home },
    { id: 'tasks', name: 'Task List', icon: CheckSquare },
    { id: 'journal', name: 'Journal', icon: BookOpen },
    { id: 'habits', name: 'Habit Tracker', icon: Activity },
    { id: 'reading', name: 'Reading List', icon: Star },
    { id: 'embeddings', name: 'Embeddings Manager', icon: Brain },
    { id: 'dependencies', name: 'Dependencies', icon: Network },
    { id: 'database', name: 'Database', icon: Database },
  ];

  const createNewCard = async (type: 'text' | 'image' | 'code') => {
    setIsGeneratingEmbeddings(true);
    
    // Simulate embedding generation (following flowchart)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newCard: Card = {
      id: Date.now(),
      title: 'Untitled',
      type: type,
      content: '',
      tags: [],
      lastModified: 'Just now',
      embeddings: true,
      dependencies: [],
      metadata: { created: new Date().toISOString(), processed: true }
    };
    
    setCards([newCard, ...cards]);
    setShowNewCardDialog(false);
    setIsGeneratingEmbeddings(false);
  };

  const generateEmbeddings = async (cardId: number) => {
    setIsGeneratingEmbeddings(true);
    // Simulate PineCone embedding generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, embeddings: true } : card
    ));
    setIsGeneratingEmbeddings(false);
  };

  const findDependencies = (cardId: number): Card[] => {
    const card = cards.find(c => c.id === cardId);
    if (!card || !card.dependencies) return [];
    
    return cards.filter(c => card.dependencies!.includes(c.id));
  };

  const filteredCards = cards.filter(card =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSidebarItemClick = (pageId: string) => {
    setSelectedPage(pageId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const renderMainContent = (): JSX.Element => {
    switch (selectedPage) {
      case 'search':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Cards & Documents
              </h2>
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by content, tags, or metadata..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-sm text-gray-600">
                Found {filteredCards.length} cards matching your search
              </div>
            </div>
          </div>
        );

      case 'embeddings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Embeddings Manager
              </h2>
              <div className="space-y-4">
                {cards.map(card => (
                  <div key={card.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg gap-3">
                    <div className="flex-1">
                      <h3 className="font-medium">{card.title}</h3>
                      <p className="text-sm text-gray-600">{card.type} • {card.tags.join(', ')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {card.embeddings ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <Zap className="w-4 h-4" />
                          Generated
                        </span>
                      ) : (
                        <button
                          onClick={() => generateEmbeddings(card.id)}
                          disabled={isGeneratingEmbeddings}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isGeneratingEmbeddings ? 'Generating...' : 'Generate'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'dependencies':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Network className="w-5 h-5" />
                Card Dependencies & Links
              </h2>
              <div className="space-y-4">
                {cards.map(card => {
                  const deps = findDependencies(card.id);
                  return (
                    <div key={card.id} className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-medium mb-2">{card.title}</h3>
                      {deps.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">Depends on:</p>
                          {deps.map(dep => (
                            <div key={dep.id} className="flex items-center gap-2 text-sm">
                              <Link className="w-3 h-3 text-blue-500" />
                              <span>{dep.title}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No dependencies</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'database':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Storage
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-500" />
                    PineCone (Embeddings)
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">Vector database for semantic search</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Stored Embeddings:</span>
                      <span className="font-mono">{cards.filter(c => c.embeddings).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dimensions:</span>
                      <span className="font-mono">1536</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-500" />
                    PostgreSQL (Metadata)
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">Relational data and metadata</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Cards:</span>
                      <span className="font-mono">{cards.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Tags:</span>
                      <span className="font-mono">{new Set(cards.flatMap(c => c.tags)).size}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                Task List
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded">
                  <input type="checkbox" className="rounded" />
                  <span>Generate embeddings for new cards</span>
                </div>
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded">
                  <input type="checkbox" checked readOnly className="rounded" />
                  <span className="line-through text-gray-500">Set up PineCone integration</span>
                </div>
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded">
                  <input type="checkbox" className="rounded" />
                  <span>Implement dependency linking</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 lg:p-6">
              <h2 className="text-2xl font-semibold mb-2">Welcome to HobHeaap</h2>
              <p className="text-gray-600">Intelligent card and document management system</p>
            </div>
          </div>
        );
    }
  };

  const CardItem: React.FC<{ card: Card }> = ({ card }) => {
    const IconComponent = cardTypes.find(type => type.id === card.type)?.icon || FileText;
    const dependencies = findDependencies(card.id);
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconComponent className="w-4 h-4 text-gray-600" />
            <h3 className="font-medium text-gray-900 truncate">{card.title}</h3>
            {card.embeddings && <Zap className="w-3 h-3 text-green-500 flex-shrink-0" title="Has embeddings" />}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button className="p-1 hover:bg-gray-100 rounded">
              <Edit className="w-3 h-3 text-gray-400" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreHorizontal className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {card.content}
        </p>
        
        {dependencies.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Dependencies:</p>
            <div className="flex gap-1 flex-wrap">
              {dependencies.slice(0, 2).map(dep => (
                <span key={dep.id} className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded truncate max-w-[120px]">
                  {dep.title.length > 15 ? dep.title.substring(0, 15) + '...' : dep.title}
                </span>
              ))}
              {dependencies.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{dependencies.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex gap-1 flex-wrap">
            {card.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                {tag}
              </span>
            ))}
            {card.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{card.tags.length - 3}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">{card.lastModified}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex relative">
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-50 ${
        isMobile 
          ? `fixed left-0 top-0 h-full ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64` 
          : sidebarExpanded 
            ? 'w-64' 
            : 'w-16'
      }`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded">
                <img src="./logo.png" alt="" />
              </div>
              {(sidebarExpanded || isMobile) && (
                <span className="font-semibold text-gray-900">HobHeaap</span>
              )}
            </div>
            {isMobile && (
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {sidebarItems.map(item => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSidebarItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors ${
                    selectedPage === item.id ? 'bg-gray-100' : ''
                  }`}
                >
                  <IconComponent className="w-4 h-4 text-gray-600" />
                  {(sidebarExpanded || isMobile) && <span className="text-gray-700">{item.name}</span>}
                </button>
              );
            })}
          </div>

          {(sidebarExpanded || isMobile) && (
            <>
              <div className="px-4 py-2 border-t border-gray-200 mt-4">
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                  <Users className="w-4 h-4" />
                  <span>Start collaborating</span>
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <div className="px-4 py-2">
                <div className="flex items-center gap-2 mb-2">
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                  <span className="text-sm text-gray-600">Private</span>
                </div>
                
                <div className="ml-2">
                  {privateItems.map(item => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSidebarItemClick(item.id)}
                        className={`w-full flex items-center gap-3 px-2 py-1.5 rounded text-sm hover:bg-gray-100 transition-colors ${
                          selectedPage === item.id ? 'bg-gray-100' : ''
                        }`}
                      >
                        <IconComponent className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 text-sm">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => !isMobile && setSidebarExpanded(!sidebarExpanded)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <Settings className="w-4 h-4" />
            {(sidebarExpanded || isMobile) && <span>Settings</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {isMobile && (
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 truncate">
                {selectedPage === 'search' && 'Search'}
                {selectedPage === 'home' && 'Dashboard'}
                {selectedPage === 'embeddings' && 'Embeddings'}
                {selectedPage === 'dependencies' && 'Dependencies'}
                {selectedPage === 'database' && 'Database'}
                {selectedPage === 'tasks' && 'Tasks'}
                {!['search', 'home', 'embeddings', 'dependencies', 'database', 'tasks'].includes(selectedPage) && 'Cards & Documents'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowNewCardDialog(true)}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Card</span>
              </button>
            </div>
          </div>

          {selectedPage === 'home' && (
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Quick search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {showNewCardDialog ? (
            <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Create New Card</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {cardTypes.map(type => {
                    const IconComponent = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setNewCardType(type.id)}
                        className={`flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 transition-colors ${
                          newCardType === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <IconComponent className="w-6 h-6 text-gray-600" />
                        <span className="text-sm font-medium">{type.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => createNewCard(newCardType)}
                  disabled={isGeneratingEmbeddings}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isGeneratingEmbeddings ? 'Creating & Generating Embeddings...' : 'Create Card'}
                </button>
                <button 
                  onClick={() => setShowNewCardDialog(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          {selectedPage === 'home' || selectedPage === 'search' ? (
            <>
              {renderMainContent()}
              
              {filteredCards.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No cards found</h3>
                  <p className="text-gray-500 mb-4 px-4">
                    {searchQuery ? 'Try adjusting your search terms' : 'Create your first card to get started'}
                  </p>
                  {!searchQuery && (
                    <button 
                      onClick={() => setShowNewCardDialog(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create First Card
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
                  {filteredCards.map(card => (
                    <CardItem key={card.id} card={card} />
                  ))}
                </div>
              )}
            </>
          ) : (
            renderMainContent()
          )}
        </div>

        {/* Status Bar */}
        <div className="bg-white border-t border-gray-200 px-4 lg:px-6 py-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 gap-2">
            <span>{filteredCards.length} cards • {cards.filter(c => c.embeddings).length} with embeddings</span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span>Last updated: Aug 26, 2025</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>PineCone Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;