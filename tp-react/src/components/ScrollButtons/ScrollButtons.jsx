import {FaChevronDown, FaChevronUp} from 'react-icons/fa';
import './ScrollButtons.css';

const ScrollButtons = ({containerSelector = '.background'}) => {
    const scrollToTop = () => {
        const container = document.querySelector(containerSelector);
        if (container) {
            container.scrollTo({top: 0, behavior: 'smooth'});
        }
    };

    const scrollToBottom = () => {
        const container = document.querySelector(containerSelector);
        if (container) {
            container.scrollTo({top: container.scrollHeight, behavior: 'smooth'});
        }
    };

    return (
        <div className="scroll-buttons">
            <button className="scroll-btn" onClick={scrollToTop} title="맨 위로">
                <FaChevronUp/>
            </button>
            <button className="scroll-btn" onClick={scrollToBottom} title="맨 아래로">
                <FaChevronDown/>
            </button>
        </div>
    );
};

export default ScrollButtons;
