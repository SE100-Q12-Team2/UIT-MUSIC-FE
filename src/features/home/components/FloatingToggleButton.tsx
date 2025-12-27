import { Button } from '@/components/ui/button';

interface HomeFloatingButtonToggleProps {
  setIsPlayerVisible: (visible: boolean) => void;
}

export default function HomeFloatingButtonToggle({
  setIsPlayerVisible,
}: HomeFloatingButtonToggleProps) {
  return (
    <Button
      onClick={() => setIsPlayerVisible(true)}
      className="
            fixed right-0 top-1/2 -translate-y-1/2 z-50
            bg-[#23233a]/90 hover:bg-[#23233a]
            text-white px-3 py-2 rounded-l-lg
            border border-white/10 shadow-lg
            transition-all
          "
    >Music Player</Button>
  );
}
