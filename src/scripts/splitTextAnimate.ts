import { animate, stagger, inView } from "motion";

// Function to split text based on type (words, chars, lines)
function splitText(element: HTMLElement, splitBy: 'words' | 'chars' | 'lines'): HTMLElement[] {
  // Get existing split elements if already processed
  const unitClassName = splitBy === 'lines' ? 'split-line' : 
                        splitBy === 'words' ? 'split-word' : 'split-char';
  const existingElements = element.querySelectorAll<HTMLElement>(`.${unitClassName}`);
  
  if (existingElements.length > 0) {
    return Array.from(existingElements);
  }
  
  // If not already split, process the text
  const text = element.textContent || '';
  element.innerHTML = '';
  const elements: HTMLElement[] = [];
  
  if (splitBy === 'lines') {
    // Split by lines
    const lines = text.split(/\r?\n/);
    lines.forEach(line => {
      const div = document.createElement('div');
      div.textContent = line || '\u00A0';
      div.classList.add('split-line');
      element.appendChild(div);
      elements.push(div);
    });
  } else if (splitBy === 'words') {
    // Split by words, preserving line breaks
    const lines = text.split(/\r?\n/);
    lines.forEach(line => {
      const lineDiv = document.createElement('div');
      lineDiv.classList.add('split-line');
      
      const words = line.split(/\s+/).filter(word => word.length > 0);
      if (words.length === 0) {
        lineDiv.innerHTML = '&nbsp;';
      } else {
        words.forEach((word, i) => {
          const span = document.createElement('span');
          span.textContent = word;
          span.classList.add('split-word');
          lineDiv.appendChild(span);
          elements.push(span);
          
          if (i < words.length - 1) {
            lineDiv.appendChild(document.createTextNode(' '));
          }
        });
      }
      element.appendChild(lineDiv);
    });
  } else if (splitBy === 'chars') {
    // Split by characters, preserving line breaks
    const lines = text.split(/\r?\n/);
    lines.forEach(line => {
      const lineDiv = document.createElement('div');
      lineDiv.classList.add('split-line');
      
      if (!line) {
        lineDiv.innerHTML = '&nbsp;';
      } else {
        Array.from(line).forEach(char => {
          const span = document.createElement('span');
          span.textContent = char;
          span.classList.add('split-char');
          lineDiv.appendChild(span);
          elements.push(span);
        });
      }
      element.appendChild(lineDiv);
    });
  }
  
  return elements;
}

// Initialize all split text containers
document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('.split-text-container');
  
  containers.forEach(container => {
    const htmlContainer = container as HTMLElement;
    const splitBy = htmlContainer.dataset.splitBy as 'words' | 'chars' | 'lines';
    const animationType = htmlContainer.dataset.animationType as 'fadeUp' | 'blurColorIn';
    const options = JSON.parse(htmlContainer.dataset.options || '{}');
    const shouldObserve = htmlContainer.dataset.inView === 'true';
    
    // Define animation properties based on type
    const getAnimationProps = () => {
      if (animationType === 'fadeUp') {
        return {
          opacity: [0, 1],
          y: ['1em', 0]
        };
      } else if (animationType === 'blurColorIn') {
        return {
          opacity: [0, 1],
          y: ['1em', 0],
          filter: ['blur(5px)', 'blur(0px)'],
          color: ['var(--color-red-500)', 'var(--color-gray-900)']
        };
      }
      return {};
    };
    
    // Function to animate elements
    const animateElements = () => {
      const elements = splitText(htmlContainer, splitBy);
      const animationProps = getAnimationProps();
      
      // Apply animation with stagger if defined
      const animationOptions = { ...options };
      if (options.stagger) {
        animationOptions.delay = stagger(
          typeof options.stagger === 'number' ? options.stagger : options.stagger.each,
          typeof options.stagger === 'object' ? options.stagger : undefined
        );
      }
      
      animate(elements, animationProps, animationOptions);
    };
    
    // Use inView for scroll-based animations
    if (shouldObserve) {
      inView(container, () => {
        animateElements();
        // Return cleanup function for when element leaves view
        return () => {
          const elements = splitText(htmlContainer, splitBy);
          // Reset elements to initial state with a quick fade
          animate(elements, { opacity: 0, y: '1em' }, { duration: 0.2 });
        };
      }, { 
        amount: options.inViewAmount || 0.5,
        margin: "0px 0px -10% 0px" // Slightly adjust margin to improve triggering
      });
    } else {
      // Animate immediately if not using inView
      animateElements();
    }
  });
});