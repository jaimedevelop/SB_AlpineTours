import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface BeginnerQuizState {
  address: string;
  tripDuration: string;
  noTimeLimit: boolean;
  costType: 'daily' | 'total';
  costAmount: string;
  interests: string[];
}

interface ExperiencedQuizState {
  region: 'East' | 'West' | 'Rocky' | 'Central';
  skill: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  budget: 'budget' | 'moderate' | 'premium' | 'luxury';
  interests: string[];
}

interface QuizStateHandlerProps {
  setPriceRange: (range: [number, number]) => void;
  setSelectedDifficulties: (difficulties: string[]) => void;
  setActiveFilter: (filter: string | null) => void;
  setLocation: (location: string) => void;
  setSelectedRegion: (region: string) => void;
}

const normalizeRegion = (region: string): 'East' | 'West' | 'Rocky' | 'Central' | '' => {
  const regionMap: { [key: string]: 'East' | 'West' | 'Rocky' | 'Central' } = {
    'eastern': 'East',
    'western': 'West',
    'rocky': 'Rocky',
    'central': 'Central',
    'east': 'East',
    'west': 'West'
  };
  return regionMap[region.toLowerCase()] || '';
};

export default function useQuizStateHandler({
  setPriceRange,
  setSelectedDifficulties,
  setActiveFilter,
  setLocation,
  setSelectedRegion
}: QuizStateHandlerProps) {
  const locationHook = useLocation();

  useEffect(() => {
    const quizState = locationHook.state as BeginnerQuizState | ExperiencedQuizState | null;
    
    if (!quizState) {
      console.log('No quiz state found');
      return;
    }

    console.log('Quiz State:', quizState);

    const isBeginnerQuiz = 'address' in quizState;
    console.log('Is Beginner Quiz:', isBeginnerQuiz);

    if (isBeginnerQuiz) {
      const beginnerState = quizState as BeginnerQuizState;
      console.log('Beginner Quiz State:', beginnerState);

      // Set price filter from beginner quiz
      if (beginnerState.costType === 'daily') {
        const costAmount = Number(beginnerState.costAmount);
        console.log('Setting price range:', [0, costAmount]);
        setPriceRange([0, costAmount]);
      }

      // Set difficulty filter for beginners
      console.log('Setting difficulty to Green');
      setSelectedDifficulties(['Green']);
      setActiveFilter('difficulty');

      // Set distance filter if location is provided
      if (beginnerState.address) {
        console.log('Setting location:', beginnerState.address);
        setLocation(beginnerState.address);
        setActiveFilter('distance');
      }
    } else {
      const experiencedState = quizState as ExperiencedQuizState;
      console.log('Experienced Quiz State:', experiencedState);

      // Set region filter
      if (experiencedState.region) {
        const normalizedRegion = normalizeRegion(experiencedState.region);
        console.log('Setting normalized region:', normalizedRegion);
        setSelectedRegion(normalizedRegion);
        
        if (normalizedRegion) {
          // Temporarily set active filter to region to trigger the map movement
          setActiveFilter('region');
          // Close the filter panel after a short delay
          setTimeout(() => {
            setActiveFilter(null);
          }, 500);
        }
      }

      // Set difficulty filter based on skill level
      const skillLevelToDifficulty: Record<string, string[]> = {
        'beginner': ['green'],
        'intermediate': ['blue'],
        'advanced': ['black'],
        'expert': ['doubleBlack']
      };
      
      if (experiencedState.skill && skillLevelToDifficulty[experiencedState.skill]) {
        const difficulties = skillLevelToDifficulty[experiencedState.skill];
        console.log('Setting difficulties:', difficulties);
        setSelectedDifficulties(difficulties);
        setActiveFilter('difficulty');
      }

      // Set price filter
      if (experiencedState.budget) {
        const budgetRanges: Record<string, [number, number]> = {
          'budget': [0, 100],
          'moderate': [100, 200],
          'premium': [200, 300],
          'luxury': [300, 500]
        };
        
        if (budgetRanges[experiencedState.budget]) {
          const priceRange = budgetRanges[experiencedState.budget];
          console.log('Setting price range:', priceRange);
          setPriceRange(priceRange);
        }
      }

      // Set the active filter to region last
      setTimeout(() => {
        console.log('Setting active filter to region');
        setActiveFilter('region');
      }, 100);
    }
  }, [setPriceRange, setSelectedDifficulties, setActiveFilter, setLocation, setSelectedRegion]);
}