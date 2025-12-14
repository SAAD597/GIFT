'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Heart, Sparkles, Music, Music2, X } from 'lucide-react'

// Enhanced Character Components with detailed design
interface CharacterProps {
  type: 'bunny' | 'bear'
  position: { x: number; y: number }
  emotion: 'idle' | 'blush' | 'happy' | 'surprised' | 'shy' | 'hugging' | 'pointing' | 'thinking'
  size?: number
  onClick?: () => void
  isBreathing?: boolean
}

function Character({ type, position, emotion, size = 120, onClick, isBreathing = true }: CharacterProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [blinkTimer, setBlinkTimer] = useState(0)
  
  const triggerAnimation = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 600)
  }

  useEffect(() => {
    triggerAnimation()
  }, [emotion])

  // Blink animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkTimer(prev => prev + 1)
    }, type === 'bunny' ? 3000 : 4500)
    
    return () => clearInterval(blinkInterval)
  }, [type])

  const bearColors = {
    body: '#F5E6D3',
    bodyShadow: '#E8D4B8',
    ears: '#D4A574',
    earsInner: '#C19660',
    nose: '#8B4513',
    eyes: '#4A3020',
    cheeks: '#FFB3BA'
  }

  const bunnyColors = {
    body: '#FFF5F5',
    bodyShadow: '#FFE8E8',
    ears: '#FFB3BA',
    earsInner: '#FF69B4',
    nose: '#FF69B4',
    eyes: '#4A3020',
    cheeks: '#FFB3BA'
  }

  const colors = type === 'bunny' ? bunnyColors : bearColors

  const getEyeShape = () => {
    switch (emotion) {
      case 'happy': return 'M 42 38 Q 42 41 44 38'
      case 'surprised': return 'M 42 38 L 42 40 L 44 40 L 44 38 Z'
      case 'shy': return 'M 42 39 Q 42 40 44 39'
      default: return 'M 42 38 Q 42 40 44 38'
    }
  }

  const isBlinking = blinkTimer % 10 === 0

  return (
    <motion.div
      className="absolute cursor-pointer select-none"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        width: `${size}px`,
        height: `${size * 1.3}px`
      }}
      animate={{
        scale: isAnimating ? [1, 1.1, 1] : isBreathing ? [1, 1.02, 1] : 1,
        rotate: emotion === 'happy' ? [0, 5, -5, 0] : 0,
        y: isBreathing && emotion === 'idle' ? [0, -2, 0] : 0
      }}
      transition={{ 
        duration: emotion === 'happy' ? 0.6 : isBreathing ? 3 : 0.5,
        repeat: isBreathing && emotion === 'idle' ? Infinity : 0,
        repeatType: 'reverse'
      }}
      onClick={onClick}
    >
      <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-lg">
        {/* Shadow */}
        <ellipse cx="50" cy="125" rx="25" ry="8" fill="#00000015" />
        
        {/* Body */}
        <ellipse cx="50" cy="80" rx="30" ry="35" fill={colors.body} stroke={colors.bodyShadow} strokeWidth="1"/>
        
        {/* Belly patch */}
        <ellipse cx="50" cy="82" rx="22" ry="25" fill={colors.body} opacity="0.8"/>
        
        {/* Head */}
        <ellipse cx="50" cy="40" rx="26" ry="24" fill={colors.body} stroke={colors.bodyShadow} strokeWidth="1"/>
        
        {/* Ears */}
        {type === 'bunny' ? (
          <>
            {/* Left ear */}
            <ellipse cx="35" cy="18" rx="7" ry="18" fill={colors.ears} stroke={colors.bodyShadow} strokeWidth="1" 
                     transform={emotion === 'shy' ? 'rotate(-10 35 18)' : 'rotate(5 35 18)'}/>
            <ellipse cx="35" cy="18" rx="4" ry="10" fill={colors.earsInner} transform={emotion === 'shy' ? 'rotate(-10 35 18)' : 'rotate(5 35 18)'}/>
            
            {/* Right ear */}
            <ellipse cx="65" cy="18" rx="7" ry="18" fill={colors.ears} stroke={colors.bodyShadow} strokeWidth="1" 
                     transform={emotion === 'shy' ? 'rotate(10 65 18)' : 'rotate(-5 65 18)'}/>
            <ellipse cx="65" cy="18" rx="4" ry="10" fill={colors.earsInner} transform={emotion === 'shy' ? 'rotate(10 65 18)' : 'rotate(-5 65 18)'}/>
          </>
        ) : (
          <>
            {/* Left ear */}
            <circle cx="35" cy="28" r="8" fill={colors.ears} stroke={colors.bodyShadow} strokeWidth="1"/>
            <circle cx="35" cy="28" r="4" fill={colors.earsInner}/>
            
            {/* Right ear */}
            <circle cx="65" cy="28" r="8" fill={colors.ears} stroke={colors.bodyShadow} strokeWidth="1"/>
            <circle cx="65" cy="28" r="4" fill={colors.earsInner}/>
          </>
        )}
        
        {/* Eyes */}
        {isBlinking ? (
          <>
            <line x1="40" y1="38" x2="44" y2="38" stroke={colors.eyes} strokeWidth="2"/>
            <line x1="56" y1="38" x2="60" y2="38" stroke={colors.eyes} strokeWidth="2"/>
          </>
        ) : (
          <>
            <path d={getEyeShape()} stroke={colors.eyes} strokeWidth="1.5" fill="none"/>
            <path d={getEyeShape().replace(/42/g, '56').replace(/44/g, '58')} stroke={colors.eyes} strokeWidth="1.5" fill="none"/>
          </>
        )}
        
        {/* Nose */}
        <ellipse cx="50" cy="46" rx="2" ry="1.5" fill={colors.nose}/>
        
        {/* Mouth */}
        {emotion === 'surprised' ? (
          <ellipse cx="50" cy="50" rx="3" ry="4" fill="none" stroke={colors.eyes} strokeWidth="1"/>
        ) : (
          <>
            <path d="M 50 48 Q 45 51 42 48" stroke={colors.eyes} strokeWidth="1" fill="none" opacity="0.6"/>
            <path d="M 50 48 Q 55 51 58 48" stroke={colors.eyes} strokeWidth="1" fill="none" opacity="0.6"/>
          </>
        )}
        
        {/* Cheeks (blush) */}
        {(emotion === 'blush' || emotion === 'shy' || emotion === 'hugging') && (
          <>
            <circle cx="30" cy="44" r="5" fill={colors.cheeks} opacity="0.4"/>
            <circle cx="70" cy="44" r="5" fill={colors.cheeks} opacity="0.4"/>
          </>
        )}
        
        {/* Arms */}
        {emotion === 'hugging' ? (
          <>
            <ellipse cx="35" cy="75" rx="8" ry="18" fill={colors.body} stroke={colors.bodyShadow} strokeWidth="1" transform="rotate(-30 35 75)"/>
            <ellipse cx="65" cy="75" rx="8" ry="18" fill={colors.body} stroke={colors.bodyShadow} strokeWidth="1" transform="rotate(30 65 75)"/>
          </>
        ) : emotion === 'pointing' ? (
          <>
            <ellipse cx="30" cy="70" rx="8" ry="15" fill={colors.body} stroke={colors.bodyShadow} strokeWidth="1" transform="rotate(-45 30 70)"/>
            <ellipse cx="70" cy="75" rx="8" ry="15" fill={colors.body} stroke={colors.bodyShadow} strokeWidth="1" transform="rotate(20 70 75)"/>
          </>
        ) : (
          <>
            <ellipse cx="30" cy="75" rx="8" ry="15" fill={colors.body} stroke={colors.bodyShadow} strokeWidth="1" transform="rotate(-20 30 75)"/>
            <ellipse cx="70" cy="75" rx="8" ry="15" fill={colors.body} stroke={colors.bodyShadow} strokeWidth="1" transform="rotate(20 70 75)"/>
          </>
        )}
        
        {/* Legs */}
        <ellipse cx="40" cy="105" rx="9" ry="15" fill={colors.body} stroke={colors.bodyShadow} strokeWidth="1"/>
        <ellipse cx="60" cy="105" rx="9" ry="15" fill={colors.body} stroke={colors.bodyShadow} strokeWidth="1"/>
        
        {/* Tail */}
        {type === 'bunny' ? (
          <circle cx="78" cy="90" r="7" fill={colors.body} stroke={colors.bodyShadow} strokeWidth="1"/>
        ) : (
          <ellipse cx="78" cy="95" rx="5" ry="8" fill={colors.body} stroke={colors.bodyShadow} strokeWidth="1"/>
        )}
        
        {/* Special effects */}
        {emotion === 'happy' && (
          <>
            <text x="20" y="30" fontSize="12" fill="#FFD700">✨</text>
            <text x="70" y="25" fontSize="10" fill="#FFD700">✨</text>
          </>
        )}
        
        {emotion === 'thinking' && (
          <text x="75" y="35" fontSize="14" fill="#9CA3AF">🤔</text>
        )}
      </svg>
    </motion.div>
  )
}

// Floating Particles with more variety
function FloatingParticles({ type = 'hearts' }: { type?: 'hearts' | 'sakura' | 'sparkles' }) {
  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 12 + Math.random() * 8,
    size: 0.8 + Math.random() * 0.6
  }))

  const getParticle = () => {
    switch (type) {
      case 'sakura': return '🌸'
      case 'sparkles': return '✨'
      default: return '💕'
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute opacity-60"
          style={{ 
            left: `${particle.x}%`,
            fontSize: `${particle.size}rem`
          }}
          animate={{
            y: ['-10vh', '110vh'],
            x: [0, Math.random() * 60 - 30],
            rotate: [0, Math.random() * 360 - 180]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          {getParticle()}
        </motion.div>
      ))}
    </div>
  )
}

// Heart Trail Component
function HeartTrail() {
  const [hearts, setHearts] = useState<{id: number, x: number, y: number}[]>([])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (Math.random() > 0.9) {
      const newHeart = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      }
      setHearts(prev => [...prev.slice(-10), newHeart])
    }
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <div className="fixed inset-0 pointer-events-none">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-pink-300"
          style={{ left: heart.x, top: heart.y }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 1, 0], opacity: [1, 0.8, 0], y: -20 }}
          transition={{ duration: 2 }}
          onAnimationComplete={() => {
            setHearts(prev => prev.filter(h => h.id !== heart.id))
          }}
        >
          💕
        </motion.div>
      ))}
    </div>
  )
}

// Main Component
export default function RomanticWebsite() {
  const [currentSection, setCurrentSection] = useState(0)
  const [bunnyPosition, setBunnyPosition] = useState({ x: -150, y: 200 })
  const [bearPosition, setBearPosition] = useState({ x: window?.innerWidth || 800, y: 200 })
  const [bunnyEmotion, setBunnyEmotion] = useState<'idle' | 'blush' | 'happy' | 'surprised' | 'shy' | 'hugging' | 'pointing' | 'thinking'>('idle')
  const [bearEmotion, setBearEmotion] = useState<'idle' | 'blush' | 'happy' | 'surprised' | 'shy' | 'hugging' | 'pointing' | 'thinking'>('idle')
  const [showThought, setShowThought] = useState(false)
  const [teasingIndex, setTeasingIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [musicOn, setMusicOn] = useState(false)
  const [blushCount, setBlushCount] = useState(0)
  const [showWhyExists, setShowWhyExists] = useState(false)
  const [showAffirmation, setShowAffirmation] = useState(false)
  const [currentAffirmation, setCurrentAffirmation] = useState('')
  const [microText, setMicroText] = useState('')
  const [showMicroText, setShowMicroText] = useState(false)
  const [bunnyWhisper, setBunnyWhisper] = useState('')
  const [bearWhisper, setBearWhisper] = useState('')
  const [showBunnyWhisper, setShowBunnyWhisper] = useState(false)
  const [showBearWhisper, setShowBearWhisper] = useState(false)

  const teasingLines = [
    "I tried to act cool. Didn't work.",
    "You weren't supposed to smile yet.",
    "This is where it gets awkward.",
    "Please don't judge me.",
    "I swear this sounded better in my head.",
    "If you're smiling, I win.",
    "Why is this making me nervous?",
    "This part is embarrassing.",
    "I suddenly forgot how words work.",
    "I hope this isn't too much.",
    "Okay… deep breath.",
    "You have a comforting presence.",
    "People probably trust you easily.",
    "You feel like peace.",
    "You're effortlessly warm.",
    "You're… kind of special."
  ]

  const bunnyWhispers = [
    "She's kind of amazing, you know…",
    "Don't look now, but she's smiling.",
    "I think I like her energy.",
    "Why does she feel so safe?"
  ]

  const bearWhispers = [
    "I hope she feels comfortable here.",
    "She deserves gentle things.",
    "I don't want to scare her.",
    "I just want her to smile."
  ]

  const affirmations = [
    "You're doing your best.",
    "You're allowed to go at your pace.",
    "You don't owe anyone anything.",
    "You're enough."
  ]

  const microTexts = [
    "Oh… hi.",
    "She's here.",
    "Okay, stay calm.",
    "This feels important.",
    "Why is my heart louder?",
    "Act normal. Act normal."
  ]

  useEffect(() => {
    // Entrance animation for Section 1
    setTimeout(() => {
      setBunnyPosition({ x: 50, y: 200 })
      setBearPosition({ x: (window?.innerWidth || 800) - 170, y: 200 })
      setBunnyEmotion('blush')
      setBearEmotion('blush')
      setBlushCount(prev => prev + 1)
    }, 500)

    setTimeout(() => {
      setBunnyEmotion('idle')
      setBearEmotion('idle')
    }, 2000)

    // Micro text appearances
    const microTextInterval = setInterval(() => {
      if (Math.random() > 0.7 && !showMicroText) {
        const randomText = microTexts[Math.floor(Math.random() * microTexts.length)]
        setMicroText(randomText)
        setShowMicroText(true)
        setBunnyEmotion('blush')
        setBearEmotion('blush')
        setBlushCount(prev => prev + 1)
        
        setTimeout(() => {
          setShowMicroText(false)
          setBunnyEmotion('idle')
          setBearEmotion('idle')
        }, 3000)
      }
    }, 8000)

    return () => clearInterval(microTextInterval)
  }, [])

  const handleBunnyClick = () => {
    const randomWhisper = bunnyWhispers[Math.floor(Math.random() * bunnyWhispers.length)]
    setBunnyWhisper(randomWhisper)
    setShowBunnyWhisper(true)
    setBunnyEmotion('shy')
    
    setTimeout(() => {
      setShowBunnyWhisper(false)
      setBunnyEmotion('idle')
    }, 3000)
  }

  const handleBearClick = () => {
    const randomWhisper = bearWhispers[Math.floor(Math.random() * bearWhispers.length)]
    setBearWhisper(randomWhisper)
    setShowBearWhisper(true)
    setBearEmotion('shy')
    
    setTimeout(() => {
      setShowBearWhisper(false)
      setBearEmotion('idle')
    }, 3000)
  }

  const handleSectionChange = (newSection: number) => {
    if (newSection === 2) {
      setBunnyPosition({ x: 100, y: 150 })
      setBearPosition({ x: (window?.innerWidth || 800) - 220, y: 150 })
    } else if (newSection === 3) {
      setBunnyPosition({ x: 80, y: 180 })
      setBearPosition({ x: (window?.innerWidth || 800) - 200, y: 180 })
    } else if (newSection === 4) {
      setBunnyPosition({ x: 150, y: 200 })
      setBearPosition({ x: 250, y: 200 })
    }
    setCurrentSection(newSection)
  }

  const handleThoughtClick = () => {
    setShowThought(true)
    setBunnyEmotion('thinking')
    setBearEmotion('thinking')
    
    setTimeout(() => {
      setBunnyEmotion('shy')
      setBearEmotion('shy')
      setBlushCount(prev => prev + 1)
    }, 2000)
  }

  const handleTeasingClick = () => {
    setTeasingIndex((prev) => (prev + 1) % teasingLines.length)
    setBunnyEmotion('pointing')
    setBearEmotion('shy')
    setBlushCount(prev => prev + 1)
    
    setTimeout(() => {
      setBunnyEmotion('happy')
      setBearEmotion('blush')
    }, 1000)
    
    setTimeout(() => {
      setBunnyEmotion('idle')
      setBearEmotion('idle')
    }, 2500)
  }

  const handleFailedConfession = () => {
    setBunnyEmotion('shy')
    setBearEmotion('surprised')
    
    setTimeout(() => {
      setBunnyEmotion('idle')
      setBearEmotion('idle')
    }, 2000)
  }

  const handleProposalClick = () => {
    setBunnyEmotion('hugging')
    setBearEmotion('hugging')
    setBunnyPosition({ x: 180, y: 200 })
    setBearPosition({ x: 220, y: 200 })
  }

  const handleChoice = (choice: string) => {
    setSelectedChoice(choice)
    if (choice === 'A' || choice === 'B') {
      setBunnyEmotion('happy')
      setBearEmotion('happy')
    } else {
      setBunnyEmotion('idle')
      setBearEmotion('idle')
    }
  }

  const handleAffirmation = () => {
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)]
    setCurrentAffirmation(randomAffirmation)
    setShowAffirmation(true)
    
    setTimeout(() => {
      setShowAffirmation(false)
    }, 4000)
  }

  const getBackgroundGradient = () => {
    switch (currentSection) {
      case 0: return 'from-pink-50 via-purple-50 to-blue-50'
      case 1: return 'from-pink-100 via-purple-100 to-blue-100'
      case 2: return 'from-purple-50 via-pink-50 to-yellow-50'
      case 3: return 'from-blue-50 via-purple-50 to-pink-50'
      case 4: return 'from-pink-50 via-yellow-50 to-purple-50'
      default: return 'from-pink-50 via-purple-50 to-blue-50'
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-1000 relative overflow-hidden`}>
      {/* Floating Particles */}
      <FloatingParticles type={currentSection < 3 ? 'sakura' : 'hearts'} />
      
      {/* Heart Trail */}
      <HeartTrail />
      
      {/* Characters */}
      <Character 
        type="bunny" 
        position={bunnyPosition} 
        emotion={bunnyEmotion} 
        onClick={handleBunnyClick}
      />
      <Character 
        type="bear" 
        position={bearPosition} 
        emotion={bearEmotion} 
        onClick={handleBearClick}
      />
      
      {/* Micro Text */}
      <AnimatePresence>
        {showMicroText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-20"
          >
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-purple-700 shadow-lg">
              {microText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Whispers */}
      <AnimatePresence>
        {showBunnyWhisper && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-20"
            style={{ left: bunnyPosition.x + 100, top: bunnyPosition.y }}
          >
            <div className="bg-pink-100/90 backdrop-blur-sm px-3 py-2 rounded-2xl text-xs text-pink-800 shadow-lg max-w-32">
              {bunnyWhisper}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBearWhisper && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-20"
            style={{ left: bearPosition.x - 100, top: bearPosition.y }}
          >
            <div className="bg-blue-100/90 backdrop-blur-sm px-3 py-2 rounded-2xl text-xs text-blue-800 shadow-lg max-w-32">
              {bearWhisper}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music Toggle */}
      <motion.button
        className="fixed top-4 right-4 z-50 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setMusicOn(!musicOn)}
      >
        {musicOn ? <Music className="w-5 h-5 text-pink-500" /> : <Music2 className="w-5 h-5 text-gray-400" />}
      </motion.button>

      {/* Blush Counter */}
      <div className="fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full text-sm text-purple-700 shadow-lg">
        💕 Blush count: {blushCount}
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-8 max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {currentSection === 0 && (
            <motion.div
              key="section1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6 mt-32"
            >
              <motion.p 
                className="text-lg md:text-xl text-purple-800 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                Hey…
              </motion.p>
              <motion.p 
                className="text-lg md:text-xl text-purple-800 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
              >
                this little place exists for one reason.
              </motion.p>
              <motion.p 
                className="text-lg md:text-xl text-purple-800 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1 }}
              >
                And yes… it's you 🌸
              </motion.p>
              
              <motion.p 
                className="text-sm text-purple-600 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4, duration: 1 }}
              >
                No pressure. Just vibes.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5, duration: 1 }}
              >
                <Button 
                  onClick={() => handleSectionChange(1)}
                  className="bg-pink-200 hover:bg-pink-300 text-purple-800 rounded-full px-8 py-3 text-lg shadow-lg"
                >
                  Continue 💕
                </Button>
              </motion.div>
            </motion.div>
          )}

          {currentSection === 1 && (
            <motion.div
              key="section2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center min-h-screen space-y-6"
            >
              <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl max-w-sm">
                <Button
                  onClick={handleThoughtClick}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-full px-6 py-3 text-lg mb-4 w-full"
                >
                  💭 What is love?
                </Button>
                
                <AnimatePresence>
                  {showThought && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center space-y-3"
                    >
                      <div className="text-2xl">✨</div>
                      <p className="text-purple-700 italic">
                        "Love is when someone becomes part of your calm,<br/>
                        not your chaos.<br/>
                        When their presence feels like home."
                      </p>
                      <div className="text-2xl">💕</div>
                      <p className="text-xs text-purple-500 italic">
                        …okay that sounded deep. Sorry.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
              
              <Button 
                onClick={() => handleSectionChange(2)}
                className="bg-pink-200 hover:bg-pink-300 text-purple-800 rounded-full px-8 py-3 shadow-lg"
              >
                Next 🌸
              </Button>
            </motion.div>
          )}

          {currentSection === 2 && (
            <motion.div
              key="section3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center min-h-screen space-y-6"
            >
              <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl max-w-sm">
                <h3 className="text-xl text-purple-800 mb-4 text-center font-light">Giggle moment 😄</h3>
                
                <motion.div
                  key={teasingIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-center mb-4"
                >
                  <Button
                    onClick={handleTeasingClick}
                    variant="ghost"
                    className="text-purple-700 hover:bg-purple-100 text-lg p-4 h-auto rounded-2xl"
                  >
                    {teasingLines[teasingIndex]}
                  </Button>
                </motion.div>
                
                <Button
                  onClick={handleFailedConfession}
                  variant="outline"
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl p-3 mb-3"
                >
                  Say something smooth
                </Button>
                
                <p className="text-xs text-gray-500 text-center italic">
                  Error 404: Confidence not found.<br/>
                  We tried.
                </p>
                
                <p className="text-sm text-purple-500 text-center mt-4">
                  Click the text for another one! 👆
                </p>
              </Card>
              
              <Button 
                onClick={() => handleSectionChange(3)}
                className="bg-pink-200 hover:bg-pink-300 text-purple-800 rounded-full px-8 py-3 shadow-lg"
              >
                Continue 💖
              </Button>
            </motion.div>
          )}

          {currentSection === 3 && (
            <motion.div
              key="section4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center min-h-screen space-y-6"
            >
              <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl max-w-sm">
                <motion.div 
                  className="text-center space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                >
                  <p className="text-lg text-purple-800 font-light leading-relaxed">
                    I'm not here to rush anything.
                  </p>
                  <p className="text-lg text-purple-800 font-light leading-relaxed">
                    I just wanted you to know
                  </p>
                  <p className="text-lg text-purple-800 font-light leading-relaxed">
                    that you matter to me…
                  </p>
                  <p className="text-lg text-purple-800 font-light leading-relaxed">
                    more than I expected.
                  </p>
                  <p className="text-sm text-purple-600 italic mt-4">
                    That's all.
                  </p>
                </motion.div>
                
                <Button
                  onClick={() => setShowWhyExists(true)}
                  variant="ghost"
                  className="w-full mt-4 text-purple-600 hover:text-purple-800 text-sm"
                >
                  Why this exists
                </Button>
                
                <AnimatePresence>
                  {showWhyExists && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-4 bg-purple-50 rounded-2xl"
                    >
                      <p className="text-sm text-purple-700 italic text-center">
                        "Because sometimes feelings are easier to share gently.<br/>
                        And I didn't want to scare you with big words."
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
              
              <Button 
                onClick={() => handleSectionChange(4)}
                className="bg-pink-200 hover:bg-pink-300 text-purple-800 rounded-full px-8 py-3 shadow-lg"
              >
                Almost there... 💕
              </Button>
            </motion.div>
          )}

          {currentSection === 4 && (
            <motion.div
              key="section5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center min-h-screen space-y-6"
            >
              {!selectedChoice ? (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-center space-y-4"
                  >
                    <p className="text-xl text-purple-800 font-light">So...</p>
                    <p className="text-xl text-purple-800 font-light">can I ask you something?</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                  >
                    <Button
                      onClick={handleProposalClick}
                      className="bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 text-white rounded-full px-10 py-4 text-xl shadow-lg"
                    >
                      💗 Continue this story with me?
                    </Button>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="text-3xl">💕</div>
                  
                  {selectedChoice === 'A' && (
                    <div className="space-y-3">
                      <p className="text-lg text-purple-800">
                        "Okay… that made my heart do a little flip.<br/>
                        Let's take it slow, but let's take it together 🌸"
                      </p>
                    </div>
                  )}
                  
                  {selectedChoice === 'B' && (
                    <div className="space-y-3">
                      <p className="text-lg text-purple-800">
                        "That's honestly the cutest kind of yes.<br/>
                        No pressure—just small moments, one by one ✨"
                      </p>
                    </div>
                  )}
                  
                  {selectedChoice === 'C' && (
                    <div className="space-y-3">
                      <p className="text-lg text-purple-800">
                        "Thank you for being honest.<br/>
                        Take all the time you need.<br/>
                        Your comfort matters most 💛"
                      </p>
                    </div>
                  )}
                  
                  {selectedChoice === 'D' && (
                    <div className="space-y-3">
                      <p className="text-lg text-purple-800">
                        "That's okay. Truly.<br/>
                        I'm just happy you're here 🌸"
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
              
              {selectedChoice && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-center space-y-4"
                >
                  <p className="text-xl text-purple-800 mb-4">
                    You can stay here as long as you want.
                  </p>
                  
                  <p className="text-sm text-purple-600 italic">
                    No pressure.<br/>
                    No rush.<br/>
                    Just honesty.
                  </p>
                  
                  <Button
                    onClick={handleAffirmation}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-full px-6 py-2 text-sm"
                  >
                    Press when you need a smile
                  </Button>
                  
                  <AnimatePresence>
                    {showAffirmation && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl text-purple-700 shadow-lg"
                      >
                        {currentAffirmation}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
              
              {!selectedChoice && bunnyEmotion === 'hugging' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-4 mt-8"
                >
                  <p className="text-lg text-purple-800 mb-4">
                    No matter your answer…<br/>
                    thank you for being here 💕
                  </p>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleChoice('A')}
                      variant="outline"
                      className="w-full bg-pink-50 hover:bg-pink-100 text-purple-800 rounded-2xl p-4"
                    >
                      💞 Yes… I want to try, for real.
                    </Button>
                    
                    <Button
                      onClick={() => handleChoice('B')}
                      variant="outline"
                      className="w-full bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-2xl p-4"
                    >
                      🌷 I like you… and I want to see where this goes.
                    </Button>
                    
                    <Button
                      onClick={() => handleChoice('C')}
                      variant="outline"
                      className="w-full bg-blue-50 hover:bg-blue-100 text-purple-800 rounded-2xl p-4"
                    >
                      ☁️ I need time, but I'm glad you told me.
                    </Button>
                    
                    <Button
                      onClick={() => handleChoice('D')}
                      variant="outline"
                      className="w-full bg-gray-50 hover:bg-gray-100 text-purple-800 rounded-2xl p-4"
                    >
                      🫧 I'm not ready for this, but you're sweet.
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}