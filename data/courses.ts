// Coffee Courses Database
// Premium educational content for subscription users

import brewingMasteryThumb from '@/assets/images/courses/brewing-mastery-thumb.png';
import latteArtThumb from '@/assets/images/courses/latte-art-thumb.png';
import espressoDialingThumb from '@/assets/images/courses/espresso-dialing-thumb.png';
import equipmentMaintenanceThumb from '@/assets/images/courses/equipment-maintenance-thumb.png';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type LessonType = 'video' | 'article' | 'quiz';

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: number; // minutes
  description: string;
  videoUrl?: string; // YouTube or Vimeo embed
  content?: string; // Markdown content for articles
  isPremium: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  estimatedTime: number; // total minutes
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  level: CourseLevel;
  thumbnail: any;
  instructor: string;
  rating: number;
  studentCount: number;
  modules: Module[];
  totalDuration: number; // minutes
  isPremium: boolean;
}

export const courses: Course[] = [
  // COURSE 1: Brewing Mastery
  {
    id: 'course-brewing-mastery',
    title: 'Brewing Mastery',
    subtitle: 'From Pour-Over to French Press',
    description: 'Master every brewing method with detailed techniques, recipes, and troubleshooting. Learn the science behind extraction and dial in perfect cups every time.',
    level: 'intermediate',
    thumbnail: brewingMasteryThumb,
    instructor: 'James Hoffmann',
    rating: 4.9,
    studentCount: 12847,
    totalDuration: 180,
    isPremium: true,
    modules: [
      {
        id: 'brewing-fundamentals',
        title: 'Brewing Fundamentals',
        description: 'Understanding extraction, ratios, and water quality',
        estimatedTime: 45,
        lessons: [
          {
            id: 'lesson-extraction-basics',
            title: 'Understanding Extraction',
            type: 'video',
            duration: 15,
            description: 'Learn what extraction means and why it matters for great coffee.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: false // Free preview
          },
          {
            id: 'lesson-coffee-ratios',
            title: 'Coffee to Water Ratios',
            type: 'video',
            duration: 12,
            description: 'Master the golden ratio and how to adjust for different brew methods.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          },
          {
            id: 'lesson-water-quality',
            title: 'Water Quality & Temperature',
            type: 'video',
            duration: 18,
            description: 'Why water matters and how to optimize it for better coffee.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          }
        ]
      },
      {
        id: 'pour-over-techniques',
        title: 'Pour-Over Techniques',
        description: 'V60, Chemex, and Kalita Wave mastery',
        estimatedTime: 60,
        lessons: [
          {
            id: 'lesson-v60-basics',
            title: 'V60 Brewing Guide',
            type: 'video',
            duration: 20,
            description: 'Step-by-step V60 technique with James Hoffmann\'s method.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          },
          {
            id: 'lesson-chemex-brewing',
            title: 'Chemex Brewing',
            type: 'video',
            duration: 18,
            description: 'Clean, bright cups with the Chemex.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          },
          {
            id: 'lesson-kalita-wave',
            title: 'Kalita Wave Technique',
            type: 'video',
            duration: 15,
            description: 'Consistent, forgiving flat-bottom brewing.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          },
          {
            id: 'lesson-troubleshooting-pourover',
            title: 'Troubleshooting Pour-Over',
            type: 'article',
            duration: 7,
            description: 'Fix common issues: slow drip, bitter taste, weak coffee.',
            content: '# Troubleshooting Guide\n\n...',
            isPremium: true
          }
        ]
      },
      {
        id: 'immersion-methods',
        title: 'Immersion Methods',
        description: 'French Press, AeroPress, and Cold Brew',
        estimatedTime: 50,
        lessons: [
          {
            id: 'lesson-french-press',
            title: 'French Press Mastery',
            type: 'video',
            duration: 15,
            description: 'Full-bodied, rich coffee with proper technique.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          },
          {
            id: 'lesson-aeropress',
            title: 'AeroPress Techniques',
            type: 'video',
            duration: 20,
            description: 'Standard and inverted methods, plus competition recipes.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          },
          {
            id: 'lesson-cold-brew',
            title: 'Cold Brew & Japanese Iced Coffee',
            type: 'video',
            duration: 15,
            description: 'Smooth cold brew and flash-chilled pour-over.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          }
        ]
      },
      {
        id: 'advanced-brewing',
        title: 'Advanced Techniques',
        description: 'Dialing in, cupping, and recipe development',
        estimatedTime: 25,
        lessons: [
          {
            id: 'lesson-dialing-in',
            title: 'Dialing In Your Brew',
            type: 'video',
            duration: 15,
            description: 'Systematic approach to perfecting any brew method.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          },
          {
            id: 'lesson-cupping',
            title: 'Coffee Cupping Basics',
            type: 'video',
            duration: 10,
            description: 'Professional tasting techniques for home brewers.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          }
        ]
      }
    ]
  },

  // COURSE 2: Latte Art
  {
    id: 'course-latte-art',
    title: 'Latte Art Mastery',
    subtitle: 'From Hearts to Rosettas',
    description: 'Learn to create beautiful latte art with step-by-step video lessons. Master milk steaming, pouring techniques, and advanced patterns.',
    level: 'intermediate',
    thumbnail: latteArtThumb,
    instructor: 'Lance Hedrick',
    rating: 4.8,
    studentCount: 8934,
    totalDuration: 120,
    isPremium: true,
    modules: [
      {
        id: 'milk-steaming',
        title: 'Milk Steaming Fundamentals',
        description: 'Perfect microfoam every time',
        estimatedTime: 40,
        lessons: [
          {
            id: 'lesson-milk-science',
            title: 'Milk Science & Selection',
            type: 'video',
            duration: 12,
            description: 'Understanding milk composition and choosing the right milk.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: false // Free preview
          },
          {
            id: 'lesson-steaming-technique',
            title: 'Steaming Technique',
            type: 'video',
            duration: 18,
            description: 'Proper positioning, stretching, and texturing.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          },
          {
            id: 'lesson-troubleshooting-foam',
            title: 'Troubleshooting Foam',
            type: 'article',
            duration: 10,
            description: 'Fix large bubbles, thin foam, and other common issues.',
            content: '# Foam Troubleshooting\n\n...',
            isPremium: true
          }
        ]
      },
      {
        id: 'basic-patterns',
        title: 'Basic Patterns',
        description: 'Hearts, tulips, and rosettas',
        estimatedTime: 50,
        lessons: [
          {
            id: 'lesson-heart',
            title: 'The Heart',
            type: 'video',
            duration: 15,
            description: 'Your first latte art pattern: the classic heart.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          },
          {
            id: 'lesson-tulip',
            title: 'The Tulip',
            type: 'video',
            duration: 18,
            description: 'Stacked hearts create a beautiful tulip.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          },
          {
            id: 'lesson-rosetta',
            title: 'The Rosetta',
            type: 'video',
            duration: 17,
            description: 'The signature latte art pattern with flowing leaves.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          }
        ]
      },
      {
        id: 'advanced-patterns',
        title: 'Advanced Patterns',
        description: 'Swans, phoenixes, and free pour art',
        estimatedTime: 30,
        lessons: [
          {
            id: 'lesson-swan',
            title: 'The Swan',
            type: 'video',
            duration: 15,
            description: 'Elegant swan pattern for impressive presentations.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          },
          {
            id: 'lesson-free-pour',
            title: 'Free Pour Techniques',
            type: 'video',
            duration: 15,
            description: 'Create your own designs with advanced pouring.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          }
        ]
      }
    ]
  },

  // COURSE 3: Espresso Dialing
  {
    id: 'course-espresso-dialing',
    title: 'Espresso Dialing',
    subtitle: 'Perfect Shots Every Time',
    description: 'Master the art and science of espresso extraction. Learn to dial in any bean, troubleshoot problems, and pull consistently excellent shots.',
    level: 'advanced',
    thumbnail: espressoDialingThumb,
    instructor: 'Scott Rao',
    rating: 5.0,
    studentCount: 6234,
    totalDuration: 150,
    isPremium: true,
    modules: [
      {
        id: 'espresso-fundamentals',
        title: 'Espresso Fundamentals',
        description: 'Understanding pressure, temperature, and extraction',
        estimatedTime: 45,
        lessons: [
          {
            id: 'lesson-espresso-science',
            title: 'The Science of Espresso',
            type: 'video',
            duration: 20,
            description: 'Pressure, temperature, and extraction explained.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: false // Free preview
          },
          {
            id: 'lesson-grind-size',
            title: 'Grind Size & Distribution',
            type: 'video',
            duration: 15,
            description: 'Why grind matters more than you think.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          },
          {
            id: 'lesson-dose-yield',
            title: 'Dose, Yield, and Ratios',
            type: 'video',
            duration: 10,
            description: 'Finding the right recipe for any bean.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          }
        ]
      },
      {
        id: 'puck-preparation',
        title: 'Puck Preparation',
        description: 'Distribution, tamping, and consistency',
        estimatedTime: 35,
        lessons: [
          {
            id: 'lesson-wdt',
            title: 'WDT Technique',
            type: 'video',
            duration: 12,
            description: 'Weiss Distribution Technique for even extraction.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          },
          {
            id: 'lesson-tamping',
            title: 'Tamping Mastery',
            type: 'video',
            duration: 10,
            description: 'Consistent pressure and level tamping.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          },
          {
            id: 'lesson-channeling',
            title: 'Preventing Channeling',
            type: 'video',
            duration: 13,
            description: 'Identify and fix channeling issues.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          }
        ]
      },
      {
        id: 'dialing-in',
        title: 'Dialing In Process',
        description: 'Systematic approach to perfect espresso',
        estimatedTime: 40,
        lessons: [
          {
            id: 'lesson-baseline-shot',
            title: 'Establishing Baseline',
            type: 'video',
            duration: 15,
            description: 'Starting point for any new bean.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          },
          {
            id: 'lesson-adjusting-variables',
            title: 'Adjusting Variables',
            type: 'video',
            duration: 18,
            description: 'When to change grind, dose, temperature, or time.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          },
          {
            id: 'lesson-tasting-espresso',
            title: 'Tasting & Evaluating',
            type: 'article',
            duration: 7,
            description: 'Identify sour, bitter, and balanced shots.',
            content: '# Espresso Tasting Guide\n\n...',
            isPremium: true
          }
        ]
      },
      {
        id: 'advanced-espresso',
        title: 'Advanced Techniques',
        description: 'Pressure profiling and temperature surfing',
        estimatedTime: 30,
        lessons: [
          {
            id: 'lesson-pressure-profiling',
            title: 'Pressure Profiling',
            type: 'video',
            duration: 15,
            description: 'Manipulating pressure for better extraction.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          },
          {
            id: 'lesson-temp-surfing',
            title: 'Temperature Surfing',
            type: 'video',
            duration: 15,
            description: 'Controlling temperature on single-boiler machines.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          }
        ]
      }
    ]
  },

  // COURSE 4: Equipment Maintenance
  {
    id: 'course-equipment-maintenance',
    title: 'Equipment Maintenance',
    subtitle: 'Keep Your Gear in Top Shape',
    description: 'Learn to clean, maintain, and troubleshoot your espresso machine and grinder. Extend equipment life and ensure consistent performance.',
    level: 'beginner',
    thumbnail: equipmentMaintenanceThumb,
    instructor: 'Whole Latte Love',
    rating: 4.7,
    studentCount: 4567,
    totalDuration: 90,
    isPremium: true,
    modules: [
      {
        id: 'daily-maintenance',
        title: 'Daily Maintenance',
        description: 'Quick routines for every day',
        estimatedTime: 25,
        lessons: [
          {
            id: 'lesson-backflushing',
            title: 'Backflushing Your Machine',
            type: 'video',
            duration: 10,
            description: 'Daily backflush routine for clean group heads.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: false // Free preview
          },
          {
            id: 'lesson-portafilter-cleaning',
            title: 'Portafilter & Basket Care',
            type: 'video',
            duration: 8,
            description: 'Keep your portafilter and baskets spotless.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          },
          {
            id: 'lesson-steam-wand',
            title: 'Steam Wand Maintenance',
            type: 'video',
            duration: 7,
            description: 'Prevent milk buildup and clogs.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          }
        ]
      },
      {
        id: 'weekly-maintenance',
        title: 'Weekly Maintenance',
        description: 'Deep cleaning and descaling',
        estimatedTime: 35,
        lessons: [
          {
            id: 'lesson-group-head-cleaning',
            title: 'Group Head Deep Clean',
            type: 'video',
            duration: 15,
            description: 'Remove the screen and gasket for thorough cleaning.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          },
          {
            id: 'lesson-descaling',
            title: 'Descaling Your Machine',
            type: 'video',
            duration: 20,
            description: 'Remove mineral buildup from boiler and pipes.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          }
        ]
      },
      {
        id: 'grinder-maintenance',
        title: 'Grinder Maintenance',
        description: 'Cleaning burrs and calibration',
        estimatedTime: 30,
        lessons: [
          {
            id: 'lesson-burr-cleaning',
            title: 'Cleaning Grinder Burrs',
            type: 'video',
            duration: 15,
            description: 'Remove old coffee oils for better taste.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          },
          {
            id: 'lesson-grinder-calibration',
            title: 'Grinder Calibration',
            type: 'video',
            duration: 15,
            description: 'Align burrs for optimal grinding.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPremium: true
          }
        ]
      }
    ]
  }
];

// Helper functions
export const getCourseById = (id: string) =>
  courses.find(course => course.id === id);

export const getCoursesByLevel = (level: CourseLevel) =>
  courses.filter(course => course.level === level);

export const getFreeLessons = () => {
  const freeLessons: Array<{ course: Course; lesson: Lesson }> = [];
  courses.forEach(course => {
    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        if (!lesson.isPremium) {
          freeLessons.push({ course, lesson });
        }
      });
    });
  });
  return freeLessons;
};

export const getTotalCourseDuration = (course: Course) =>
  course.modules.reduce((total, module) => total + module.estimatedTime, 0);

export const getModuleProgress = (moduleId: string, completedLessonIds: string[]) => {
  const module = courses
    .flatMap(c => c.modules)
    .find(m => m.id === moduleId);
  
  if (!module) return 0;
  
  const completed = module.lessons.filter(l => completedLessonIds.includes(l.id)).length;
  return (completed / module.lessons.length) * 100;
};

export const getCourseProgress = (courseId: string, completedLessonIds: string[]) => {
  const course = getCourseById(courseId);
  if (!course) return 0;
  
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = course.modules
    .flatMap(m => m.lessons)
    .filter(l => completedLessonIds.includes(l.id)).length;
  
  return (completedLessons / totalLessons) * 100;
};
