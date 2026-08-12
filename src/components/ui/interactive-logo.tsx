'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface InteractiveLogoProps {
  text?: string;
  className?: string;
  variant?: 'header' | 'footer-small' | 'footer-giant';
}

/**
 * InteractiveLogo Component para Teo Labs
 * 
 * Un componente reutilizable que crea un efecto de texto interactivo donde cada letra
 * reacciona a la posición del mouse con movimientos y efectos visuales.
 */
export default function InteractiveLogo({ 
  text = 'Teo Labs', 
  className, 
  variant = 'header' 
}: InteractiveLogoProps) {
  return (
    <span className={cn("flex select-none", className)}>
      {/* El texto va partido letra por letra para el efecto, asi que se expone
          una version plana para lectores de pantalla y rastreadores. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="flex">
        {text.split('').map((char, index) => (
          <AnimatedLetter
            key={index}
            char={char}
            index={index}
            variant={variant}
          />
        ))}
      </span>
    </span>
  );
}

function AnimatedLetter({ 
  char, 
  index, 
  variant 
}: { 
  char: string; 
  index: number; 
  variant: 'header' | 'footer-small' | 'footer-giant' 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const letterRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (letterRef.current) {
      const rect = letterRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      setMouseX(x);
    }
  };

  if (char === ' ') {
    return <span className={cn("inline-block", variant === 'footer-giant' ? "w-[0.3em]" : "w-[0.2em]")} />;
  }

  const getStyle = (): React.CSSProperties => {
    const intensity = variant === 'footer-giant' ? 12 : 6;
    const skew = variant === 'footer-giant' ? 20 : 10;
    const transform = isHovered 
      ? `translateY(${Math.sin(index * 0.5 + mouseX * 4) * intensity}px) skewX(${mouseX * skew}deg) scale(1.1)`
      : 'translateY(0) skewX(0) scale(1)';

    const style: React.CSSProperties = {
      transform,
      transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      fontWeight: isHovered || variant === 'footer-giant' ? '800' : '700',
    };

    if (variant === 'footer-giant') {
      if (isHovered) {
        style.textShadow = `${-6 - mouseX * 15}px 0 0 rgba(255, 0, 0, 0.7), ${6 - mouseX * 15}px 0 0 rgba(0, 255, 255, 0.7)`;
      } else {
        style.textShadow = '-4px 0 0 rgba(255, 0, 0, 0.4), 4px 0 0 rgba(0, 255, 255, 0.4)';
      }
    }

    return style;
  };

  const getClassName = () => {
    if (variant === 'footer-giant') {
      return "inline-block relative cursor-default transition-all";
    }
    return "inline-block relative cursor-default bg-gradient-to-r from-blue-600 via-purple-500 to-green-500 bg-clip-text text-transparent drop-shadow-sm";
  };

  return (
    <span
      ref={letterRef}
      className={getClassName()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMouseX(0);
      }}
      onMouseMove={handleMouseMove}
      style={getStyle()}
    >
      {char}
    </span>
  );
}
