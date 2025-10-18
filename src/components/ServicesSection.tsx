import styles from './ServicesSection.module.css';

const services = [
  {
    icon: '/cityscape.svg', // Replace with actual icon
    title: 'Buying & Selling',
    description: 'Navigate with confidence in competitive luxury markets.',
  },
  {
    icon: '/investment.svg',
    title: 'Investment Advisory',
    description: 'Maximize returns on elite real estate assets.',
  },
  {
    icon: '/relocation.svg',
    title: 'Relocation & Lifestyle',
    description: 'From schools to chauffeurs, we arrange it all.',
  },
  {
    icon: '/management.svg',
    title: 'Property Management',
    description: 'Precision management for luxury properties — effortless ownership, exceptional results.',
  },
];

export default function ServicesSection() {
  return (
    <section className={"bg-[#1A1F2B] "+styles.servicesSection}>
      <h2 className={styles.heading}>
        White-Glove <span className={styles.highlight}>Real Estate</span> Services
      </h2>
      <div className={styles.cardsContainer}>
        {services.map((service, idx) => (
          <div key={idx} className={styles.card}>
             <div className={styles.iconContainer}>
                <img src={service.icon} alt={service.title} className={styles.icon} />
            </div>

            <h3 className={styles.cardTitle}>{service.title}</h3>
            <p className={styles.cardDesc}>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
