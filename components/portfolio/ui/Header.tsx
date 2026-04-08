import StaggeredMenu from "../elements/StaggeredMenu";


const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'About', ariaLabel: 'Learn about Me', link: '/about' },
  { label: 'Projects', ariaLabel: 'View our projects', link: '/projects' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '#contact' }
];

const socialItems = [
  { label: 'Instagram', link: 'https://www.instagram.com/sreyes_v?igsh=MTJocTBjYm11NnFyeA%3D%3D' },
  { label: 'GitHub', link: 'https://github.com/sre-yes-v' },
  { label: 'LinkedIn', link: 'https://www.linkedin.com/in/sreyes-v' }
];

export default function Header() {
  return (
    <header className="fixed left-0 top-0 z-[9999] w-full pointer-events-none">
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering
        menuButtonColor="#ffffff"
        openMenuButtonColor="#fff"
        changeMenuColorOnOpen
        colors={["#1d2846", "#111827"]}
        logoUrl="/logosv.png"
        accentColor="#4658c9"
        isFixed={true}
      />
    </header>
  );
}