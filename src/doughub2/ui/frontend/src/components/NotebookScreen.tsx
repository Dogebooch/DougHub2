import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Search, FileText, Network, Plus, MoreVertical, Save, Share2, X, Link as LinkIcon, Trash2 } from 'lucide-react';
import { Note } from '../types';

// Mock initial data
const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    title: 'Cardiology Basics',
    content: 'Cardiology is the study of the #heart. key concepts include [[Hemodynamics]] and [[Arrhythmias]].\n\nRemember to review the cardiac cycle.',
    tags: ['heart', 'medicine'],
    lastModified: new Date().toISOString(),
    links: ['2', '3']
  },
  {
    id: '2',
    title: 'Hemodynamics',
    content: 'Hemodynamics relates to the flow of blood. Important for understanding [[Hypertension]].\n\nSee also [[Cardiology Basics]].',
    tags: ['physiology'],
    lastModified: new Date(Date.now() - 86400000).toISOString(),
    links: ['1', '4']
  },
  {
    id: '3',
    title: 'Arrhythmias',
    content: 'Abnormal heart rhythms. Can be atrial or ventricular. \n\nConnects to [[Cardiology Basics]] and [[Pharmacology]].',
    tags: ['pathology'],
    lastModified: new Date(Date.now() - 172800000).toISOString(),
    links: ['1', '5']
  },
  {
    id: '4',
    title: 'Hypertension',
    content: 'High blood pressure. A major risk factor for [[Stroke]] and [[Heart Attack]].\n\nRelated: [[Hemodynamics]]',
    tags: ['pathology'],
    lastModified: new Date(Date.now() - 259200000).toISOString(),
    links: ['2']
  },
  {
    id: '5',
    title: 'Pharmacology',
    content: 'Study of drugs. For arrhythmias, we use anti-arrhythmics.\n\nLinked: [[Arrhythmias]]',
    tags: ['pharma'],
    lastModified: new Date(Date.now() - 345600000).toISOString(),
    links: ['3']
  }
];

interface GraphNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export function NotebookScreen() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(INITIAL_NOTES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGraph, setShowGraph] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(300);

  // Derived state
  const selectedNote = useMemo(() => 
    notes.find(n => n.id === selectedNoteId) || null
  , [notes, selectedNoteId]);

  const filteredNotes = useMemo(() => 
    notes.filter(n => 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
  , [notes, searchQuery]);

  // Handlers
  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      tags: [],
      lastModified: new Date().toISOString(),
      links: []
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
    // If in graph mode, switch back to edit to write
    if (showGraph) setShowGraph(false);
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => {
      if (n.id !== id) return n;
      
      const updatedNote = { ...n, ...updates, lastModified: new Date().toISOString() };
      
      // Auto-detect links if content changed
      if (updates.content !== undefined) {
        const linkRegex = /\[\[(.*?)\]\]/g;
        const matches = [...updates.content.matchAll(linkRegex)];
        const linkedTitles = matches.map(m => m[1]);
        
        // Find IDs for these titles
        const linkedIds = prev
          .filter(target => linkedTitles.some(title => title.toLowerCase() === target.title.toLowerCase()))
          .map(target => target.id);
          
        updatedNote.links = linkedIds;
      }
      
      return updatedNote;
    }));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
  };

  return (
    <div className="h-full flex bg-[#2C3134] overflow-hidden">
      {/* Left Sidebar */}
      <div 
        className="flex flex-col border-r border-[#506256] bg-[#2F3A48]"
        style={{ width: leftPanelWidth }}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#506256] bg-[#254341]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#F0DED3] font-semibold flex items-center gap-2">
              <FileText size={18} className="text-[#C8A92A]" />
              Notebook
            </h2>
            <button 
              onClick={handleCreateNote}
              className="p-1.5 rounded hover:bg-[#315C62] text-[#A79385] hover:text-[#F0DED3] transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A79385]" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2F3A48] border border-[#506256] rounded px-8 py-1.5 text-sm text-[#F0DED3] placeholder-[#506256] focus:outline-none focus:border-[#C8A92A]"
            />
          </div>
        </div>

        {/* Note List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              onClick={() => setSelectedNoteId(note.id)}
              className={`
                p-4 border-b border-[#506256]/30 cursor-pointer transition-colors group
                ${selectedNoteId === note.id ? 'bg-[#315C62] border-l-4 border-l-[#C8A92A]' : 'hover:bg-[#254341] border-l-4 border-l-transparent'}
              `}
            >
              <h3 className={`font-medium mb-1 truncate ${selectedNoteId === note.id ? 'text-[#F0DED3]' : 'text-[#DEC28C]'}`}>
                {note.title || 'Untitled'}
              </h3>
              <p className="text-xs text-[#A79385] truncate mb-2">
                {note.content || 'No additional text'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#506256] uppercase tracking-wider">
                  {new Date(note.lastModified).toLocaleDateString()}
                </span>
                {note.links.length > 0 && (
                  <span className="flex items-center text-[10px] text-[#A79385] gap-1">
                    <LinkIcon size={10} /> {note.links.length}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#2C3134]">
        {/* Toolbar */}
        <div className="h-14 border-b border-[#506256] flex items-center justify-between px-6 bg-[#2F3A48]">
          <div className="flex items-center gap-4">
            <div className="flex bg-[#254341] rounded-lg p-1 border border-[#506256]">
              <button
                onClick={() => setShowGraph(false)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${!showGraph ? 'bg-[#315C62] text-[#F0DED3] shadow-sm' : 'text-[#A79385] hover:text-[#DEC28C]'}`}
              >
                Editor
              </button>
              <button
                onClick={() => setShowGraph(true)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${showGraph ? 'bg-[#315C62] text-[#F0DED3] shadow-sm' : 'text-[#A79385] hover:text-[#DEC28C]'}`}
              >
                Graph
              </button>
            </div>
            {selectedNote && (
              <span className="text-[#506256] text-sm ml-2">
                {selectedNote.id}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {selectedNote && (
              <button 
                onClick={() => handleDeleteNote(selectedNote.id)}
                className="p-2 text-[#DE634D] hover:bg-[#254341] rounded transition-colors"
                title="Delete Note"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
          {showGraph ? (
             <GraphView notes={notes} onNodeClick={setSelectedNoteId} />
          ) : (
            selectedNote ? (
              <div className="h-full flex flex-col max-w-3xl mx-auto p-8 animate-in fade-in duration-200">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) => handleUpdateNote(selectedNote.id, { title: e.target.value })}
                  className="text-4xl font-bold bg-transparent border-none text-[#F0DED3] placeholder-[#506256] focus:outline-none mb-6"
                  placeholder="Note Title"
                />
                <textarea
                  value={selectedNote.content}
                  onChange={(e) => handleUpdateNote(selectedNote.id, { content: e.target.value })}
                  className="flex-1 w-full resize-none bg-transparent border-none text-lg text-[#A79385] placeholder-[#506256] focus:outline-none leading-relaxed font-mono"
                  placeholder="Start typing... Use [[WikiLinks]] to connect notes."
                  spellCheck={false}
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#506256]">
                <FileText size={48} className="mb-4 opacity-50" />
                <p>Select a note or create a new one</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// Simple Force-Directed Graph Component using Canvas
function GraphView({ notes, onNodeClick }: { notes: Note[], onNodeClick: (id: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const draggedNodeRef = useRef<string | null>(null);
  const isDraggingRef = useRef(false);
  
  // Physics simulation state
  const nodes = useRef<GraphNode[]>([]);
  const requestRef = useRef<number>();

  // Initialize nodes and handle resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial size

    const width = canvas.width;
    const height = canvas.height;

    // Initialize nodes with random positions near center if not already set
    if (nodes.current.length === 0 || nodes.current.length !== notes.length) {
       nodes.current = notes.map(note => ({
        id: note.id,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        radius: 5 + Math.min(note.links.length * 2, 15)
      }));
    }

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [notes]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Physics Parameters
    const repulsion = 1000;
    const springLength = 150;
    const springStrength = 0.05;
    const damping = 0.85; // Slightly more friction (was 0.9)
    const centerForce = 0.0005;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Update positions
    nodes.current.forEach((node, i) => {
      // Skip physics update for dragged node
      if (node.id === draggedNodeRef.current) return;

      let fx = 0;
      let fy = 0;

      // Repulsion (Coulomb's Law-ish)
      nodes.current.forEach((other, j) => {
        if (i === j) return;
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const distSq = dx * dx + dy * dy || 1;
        const force = repulsion / distSq;
        fx += (dx / Math.sqrt(distSq)) * force;
        fy += (dy / Math.sqrt(distSq)) * force;
      });

      // Attraction (Springs) for links
      const note = notes.find(n => n.id === node.id);
      if (note) {
        note.links.forEach(linkId => {
          const targetNode = nodes.current.find(n => n.id === linkId);
          if (targetNode) {
            const dx = targetNode.x - node.x;
            const dy = targetNode.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const force = (dist - springLength) * springStrength;
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
          }
        });
      }

      // Center gravity
      fx += (width / 2 - node.x) * centerForce;
      fy += (height / 2 - node.y) * centerForce;

      // Apply
      node.vx = (node.vx + fx) * damping;
      node.vy = (node.vy + fy) * damping;
      node.x += node.vx;
      node.y += node.vy;

      // Bounds
      if (node.x < node.radius) node.x = node.radius;
      if (node.x > width - node.radius) node.x = width - node.radius;
      if (node.y < node.radius) node.y = node.radius;
      if (node.y > height - node.radius) node.y = height - node.radius;
    });

    // Draw Edges
    ctx.strokeStyle = '#506256';
    ctx.lineWidth = 1;
    notes.forEach(note => {
      const sourceNode = nodes.current.find(n => n.id === note.id);
      if (!sourceNode) return;
      
      note.links.forEach(linkId => {
        const targetNode = nodes.current.find(n => n.id === linkId);
        if (targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.stroke();
        }
      });
    });

    // Draw Nodes
    nodes.current.forEach(node => {
      const note = notes.find(n => n.id === node.id);
      const isHovered = hoveredNodeId === node.id;
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? '#C8A92A' : '#315C62';
      ctx.fill();
      ctx.strokeStyle = isHovered ? '#F0DED3' : '#09232A';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      if (note) {
        ctx.fillStyle = isHovered ? '#F0DED3' : '#A79385';
        ctx.font = isHovered ? 'bold 12px sans-serif' : '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(note.title.substring(0, 15) + (note.title.length > 15 ? '...' : ''), node.x, node.y + node.radius + 15);
      }
    });

    requestRef.current = requestAnimationFrame(animate);
  }, [notes, hoveredNodeId]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = nodes.current.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < node.radius + 5;
    });

    if (clickedNode) {
      draggedNodeRef.current = clickedNode.id;
      isDraggingRef.current = false; // Reset dragging flag, wait for move to confirm drag
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Handle dragging
    if (draggedNodeRef.current) {
      isDraggingRef.current = true;
      const node = nodes.current.find(n => n.id === draggedNodeRef.current);
      if (node) {
        node.x = x;
        node.y = y;
        node.vx = 0; // Stop momentum while dragging
        node.vy = 0;
      }
      return;
    }

    // Handle hover
    const hoveredNode = nodes.current.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < node.radius + 5;
    });

    setHoveredNodeId(hoveredNode ? hoveredNode.id : null);
    e.currentTarget.style.cursor = hoveredNode ? 'pointer' : 'default';
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggedNodeRef.current) {
      // If we were dragging (moved), don't treat as click
      if (!isDraggingRef.current) {
        onNodeClick(draggedNodeRef.current);
      }
      draggedNodeRef.current = null;
      isDraggingRef.current = false;
    }
  };

  const handleMouseLeave = () => {
    draggedNodeRef.current = null;
    isDraggingRef.current = false;
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#09232A] relative overflow-hidden">
      <div className="absolute top-4 right-4 bg-[#2F3A48]/80 p-2 rounded text-xs text-[#A79385] backdrop-blur-sm">
        Interactive Graph View
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full block"
      />
    </div>
  );
}