import logo from '@/assets/white_logotype.png';
import { useGameStore } from '@/stores/gameStore';

export default function PageHeader() {
    const toggleHelpWindow = useGameStore((state) => state.toggleHelpWindow);

    const handleShowGameRules = () => {
        toggleHelpWindow();
    };

    return (
        <div className="flex mb-10 justify-between">
            <img src={logo} alt="test" width={120} />
            <a onClick={handleShowGameRules}>How to play?</a>
        </div>
    );
}
