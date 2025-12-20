import React from 'react';
import TeamMember from './TeamMember';
import artist1 from '@/assets/artist-1.jpg';
import artist2 from '@/assets/artist-2.jpg';
import artist3 from '@/assets/artist-3.jpg';
import artist4 from '@/assets/artist-4.jpg';

const teamMembers = [
  {
    avatar: artist1,
    name: 'Ade Ian Brengo',
    email: 'Adeian Brengo@Gmail',
  },
  {
    avatar: artist2,
    name: 'Selena Sid',
    email: 'Selena Sid@Gmail',
  },
  {
    avatar: artist3,
    name: 'Justin Markel',
    email: 'Justin Markel@Gmail',
  },
  {
    avatar: artist4,
    name: 'Zidan Sdre',
    email: 'Zidan Sdre@Gmail',
  },
];

const TeamSection: React.FC = () => {
  return (
    <section className="team-section">
      <div className="team-section__header">
        <h2 className="team-section__title">Our Team</h2>
        <p className="team-section__subtitle">
          We're Lucky To Be Supported By Some Of The Best Investors In The World.
        </p>
      </div>
      <div className="team-section__grid">
        {teamMembers.map((member, index) => (
          <TeamMember
            key={index}
            avatar={member.avatar}
            name={member.name}
            email={member.email}
          />
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
