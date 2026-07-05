import { useState } from 'react'
import { useCompare } from '@/hooks/useCompare'
import { useTheme } from '@/hooks/useTheme'
import { Header } from '@/components/layout/Header'
import { DiffInput } from '@/components/diff/DiffInput'
import { CompareModal } from '@/components/diff/CompareModal'

function App() {
  const {
    original,
    setOriginal,
    modified,
    setModified,
    diffResult,
    compare,
    diffType,
    setDiffType
  } = useCompare();

  const { theme, toggleTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCompare = () => {
    compare();
    setIsModalOpen(true);
  };

  return (
    <div className="h-screen w-full bg-background text-foreground flex flex-col p-4 overflow-hidden">
      <Header onCompare={handleCompare} theme={theme} onToggleTheme={toggleTheme} />

      <CompareModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        diffResult={diffResult}
        diffType={diffType}
        setDiffType={setDiffType}
      />

      <DiffInput
        original={original}
        setOriginal={setOriginal}
        modified={modified}
        setModified={setModified}
      />
    </div>
  )
}

export default App
