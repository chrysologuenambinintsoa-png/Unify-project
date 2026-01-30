'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, BookOpen, Briefcase, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface AboutSection {
  dateOfBirth?: string;
  originCity?: string;
  currentCity?: string;
  schoolName?: string;
  collegeName?: string;
  highSchoolName?: string;
  universityName?: string;
  skills?: string[];
  pseudonym?: string;
}

interface AboutProps {
  about: AboutSection;
  isOwnProfile: boolean;
  onEdit?: () => void;
}

export const About: React.FC<AboutProps> = ({ about, isOwnProfile, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const hasInfo = Object.values(about).some(value =>
    value !== undefined && value !== null && (Array.isArray(value) ? value.length > 0 : value !== '')
  );

  if (!hasInfo && !isOwnProfile) {
    return null;
  }

  const sections = [
    {
      icon: User,
      label: 'Pseudo',
      value: about.pseudonym,
      key: 'pseudonym',
    },
    {
      icon: Calendar,
      label: 'Date de naissance',
      value: about.dateOfBirth ? formatDate(about.dateOfBirth) : undefined,
      key: 'dateOfBirth',
    },
    {
      icon: MapPin,
      label: 'Ville d\'origine',
      value: about.originCity,
      key: 'originCity',
    },
    {
      icon: MapPin,
      label: 'Ville actuelle',
      value: about.currentCity,
      key: 'currentCity',
    },
    {
      icon: BookOpen,
      label: 'École',
      value: about.schoolName,
      key: 'schoolName',
    },
    {
      icon: BookOpen,
      label: 'Collège',
      value: about.collegeName,
      key: 'collegeName',
    },
    {
      icon: BookOpen,
      label: 'Lycée',
      value: about.highSchoolName,
      key: 'highSchoolName',
    },
    {
      icon: BookOpen,
      label: 'Université',
      value: about.universityName,
      key: 'universityName',
    },
  ];

  const filledSections = sections.filter(s => s.value);

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">À propos</h2>
        {isOwnProfile && (
          <Button
            onClick={onEdit}
            variant="outline"
            size="sm"
          >
            Modifier
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Basic Info Grid */}
        {filledSections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filledSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start space-x-3"
                >
                  <Icon className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{section.label}</p>
                    <p className="text-gray-900 dark:text-white font-medium">{section.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Skills Section */}
        {about.skills && about.skills.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Compétences</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {about.skills.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-full"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {!hasInfo && isOwnProfile && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">
            Complétez votre profil pour que d'autres utilisateurs apprennent à vous connaître
          </p>
        )}
      </div>
    </Card>
  );
};
