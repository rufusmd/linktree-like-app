"use client";

const SocialLinks = () => {
  const socials = [
    {
      name: 'TikTok',
      href: '#',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.05A6.34 6.34 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1h-.04Z"/>
        </svg>
      ),
      color: 'hover:text-[#000000]',
    },
    // ... other socials ...
  ];

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="flex justify-center space-x-8">
        {socials.map((item) => (
          <a  // This tag was missing in the previous version
            key={item.name}
            href={item.href}
            className={`text-gray-400 transition-colors duration-200 ${item.color}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sr-only">{item.name}</span>
            <item.icon className="h-8 w-8" aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;