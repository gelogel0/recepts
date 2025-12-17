import React, { useState, useEffect } from 'react';
import { RecipeIdea, VideoFrame, FrameType } from '../types';
import { generateRecipeIdeas, generateStoryboard, generateImageFrame } from '../services/gemini';
import { ArrowRight, Wand2, Sparkles, Loader2, Play, UploadCloud } from 'lucide-react';

enum Step {
  IDEATION,
  SELECTION,
  GENERATION,
  REVIEW
}

const CreateProject: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.IDEATION);
  const [trendPrompt, setTrendPrompt] = useState('December Holidays');
  const [ideas, setIdeas] = useState<RecipeIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<RecipeIdea | null>(null);
  const [frames, setFrames] = useState<VideoFrame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Step 1: Generate Ideas
  const handleGenerateIdeas = async () => {
    setIsLoading(true);
    setLoadingMessage('Analyzing trends and creating viral recipes...');
    try {
      const result = await generateRecipeIdeas(trendPrompt);
      setIdeas(result);
      setStep(Step.SELECTION);
    } catch (e) {
      alert('Failed to generate ideas. Check API Key.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 -> 3: Select Idea and Start Generation Process
  const handleSelectIdea = async (idea: RecipeIdea) => {
    setSelectedIdea(idea);
    setStep(Step.GENERATION);
    setIsLoading(true);
    
    try {
      // 1. Generate Text Storyboard
      setLoadingMessage('Drafting storyboard and visual prompts with Gemini 3 Pro...');
      const storyboard = await generateStoryboard(idea);
      
      // Initialize frames structure
      const newFrames: VideoFrame[] = [
        { id: '1', type: FrameType.HOOK, prompt: storyboard.hookPrompt, description: 'Hook: Finished Dish', status: 'pending' },
        { id: '2', type: FrameType.INGREDIENTS, prompt: storyboard.ingredientsPrompt, description: 'Ingredients Laydown', status: 'pending' },
        ...storyboard.steps.map((s, i) => ({
          id: `step-${i}`,
          type: FrameType.STEP,
          prompt: s.prompt,
          description: `Step ${i+1}: ${s.description}`,
          status: 'pending' as const
        }))
      ];
      
      setFrames(newFrames);

      // 2. Generate Images Sequentially
      setLoadingMessage('Rendering high-fidelity assets (Nano Banana Pro)...');
      
      const processedFrames = [...newFrames];
      
      // Process one by one to avoid rate limits and show progress
      for (let i = 0; i < processedFrames.length; i++) {
        processedFrames[i].status = 'generating';
        setFrames([...processedFrames]); // Update UI
        
        try {
          const imageUrl = await generateImageFrame(processedFrames[i].prompt);
          processedFrames[i].imageUrl = imageUrl;
          processedFrames[i].status = 'completed';
        } catch (e) {
          processedFrames[i].status = 'failed';
        }
        setFrames([...processedFrames]); // Update UI
      }
      
      setStep(Step.REVIEW);

    } catch (e) {
      console.error(e);
      alert('Error in generation pipeline');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // Simulation of MCP / n8n webhook call
    alert("Project payload sent to n8n Webhook via MCP! Video assembly started on backend.");
  };

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Content Factory</h2>
          <p className="text-slate-400">Step {step + 1} of 4</p>
        </div>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`h-2 w-12 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-slate-700'}`} />
          ))}
        </div>
      </div>

      {/* STEP 1: IDEATION */}
      {step === Step.IDEATION && (
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full text-center">
          <div className="bg-surface p-8 rounded-3xl border border-slate-700 w-full shadow-2xl">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
              <Sparkles size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">What's trending?</h3>
            <p className="text-slate-400 mb-8">Enter a theme or season. Gemini will generate viral recipe concepts.</p>
            
            <input 
              type="text" 
              value={trendPrompt}
              onChange={(e) => setTrendPrompt(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-primary mb-6 text-lg"
              placeholder="e.g. New Year's Eve Finger Food"
            />
            
            <button 
              onClick={handleGenerateIdeas}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-indigo-600 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
              Generate Concepts
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECTION */}
      {step === Step.SELECTION && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <div 
              key={idea.id} 
              onClick={() => handleSelectIdea(idea)}
              className="bg-surface p-6 rounded-2xl border border-slate-700 hover:border-primary cursor-pointer hover:shadow-lg hover:shadow-primary/10 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-primary text-white p-2 rounded-full">
                  <ArrowRight size={20} />
                </div>
              </div>
              <div className="mb-4">
                <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-md">
                  Viral Score: {idea.viralityScore}/100
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{idea.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{idea.description}</p>
              <div className="flex flex-wrap gap-2">
                {idea.ingredients.slice(0, 3).map((ing, i) => (
                  <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                    {ing}
                  </span>
                ))}
                {idea.ingredients.length > 3 && (
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">+{idea.ingredients.length - 3}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STEP 3: GENERATING */}
      {step === Step.GENERATION && (
        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
           <div className="text-center mb-10">
             <div className="inline-block relative">
               <Loader2 size={64} className="text-primary animate-spin" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-2 h-2 bg-white rounded-full"></div>
               </div>
             </div>
             <h3 className="text-2xl font-bold text-white mt-6">{loadingMessage}</h3>
             <p className="text-slate-400 mt-2">Connecting to Gemini 3 Pro Image Preview...</p>
           </div>

           <div className="w-full bg-surface rounded-xl overflow-hidden border border-slate-700">
             <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
               <span className="text-sm font-medium text-slate-300">Generation Log</span>
               <span className="text-xs text-slate-500">{frames.filter(f => f.status === 'completed').length} / {frames.length}</span>
             </div>
             <div className="max-h-60 overflow-y-auto p-4 space-y-3">
               {frames.map((frame) => (
                 <div key={frame.id} className="flex items-center gap-3 text-sm">
                   <div className={`w-2 h-2 rounded-full ${
                     frame.status === 'completed' ? 'bg-green-400' : 
                     frame.status === 'generating' ? 'bg-yellow-400 animate-pulse' : 
                     frame.status === 'failed' ? 'bg-red-400' : 'bg-slate-600'
                   }`} />
                   <span className="text-slate-300 w-24 flex-shrink-0 font-mono text-xs opacity-70">{frame.type}</span>
                   <span className="text-white truncate flex-1">{frame.description}</span>
                 </div>
               ))}
             </div>
           </div>
        </div>
      )}

      {/* STEP 4: REVIEW */}
      {step === Step.REVIEW && (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-end mb-6">
             <div>
               <h2 className="text-3xl font-bold text-white mb-2">{selectedIdea?.title}</h2>
               <p className="text-slate-400">Review assets before sending to assembly pipeline.</p>
             </div>
             <button 
                onClick={handleExport}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-900/20 transition-all"
             >
               <UploadCloud size={20} />
               Send to n8n (Blotato)
             </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-y-auto pb-10">
            {frames.map((frame, index) => (
              <div key={frame.id} className="group relative bg-surface rounded-xl overflow-hidden border border-slate-700 aspect-[9/16]">
                {frame.imageUrl ? (
                  <img src={frame.imageUrl} alt={frame.description} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                    Failed
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100">
                   <div className="absolute bottom-0 left-0 p-3 w-full">
                     <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-black/50 px-1.5 py-0.5 rounded mb-1 inline-block">
                       {frame.type}
                     </span>
                     <p className="text-xs text-white line-clamp-2">{frame.description}</p>
                   </div>
                   <div className="absolute top-2 right-2 bg-black/50 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-white border border-white/20">
                     {index + 1}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProject;
