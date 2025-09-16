import { useEffect, useState } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Home() {

const features = [
  'Air Conditioning',
  'Washer and dryer',
  'Swimming Pool',
  'Basketball',
  '24x7 Security',
  'Central Air',
  'Media Room',
  'Indoor Game'
];

  const router = useRouter();
  const { id } = router.query;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [property, setProperty] = useState<any>(null);

   
  useEffect(() => {
      if (!id) return;
    fetch(`/api/property-details/${id}`)
      .then(res => res.json())
      .then(data => setProperty(data))
      .catch(err => console.error(err));
  }, [id]);


    if (!property) return <div>Loading...</div>;
    if (property) 

  return (
    <main style={{ background: '#f6f8fa', minHeight: '100vh', fontFamily: 'sans-serif' }}>
    {/* Hero Banner */}
    <div style={{ width: '100%', height: 220, overflow: 'hidden', position: 'relative' }}>
      <Image src='/bg.png' alt="alt1" 
       fill
    style={{ objectFit: 'cover' }}
    sizes="(max-width: 768px) 100vw, 700px" />
      <h1 style={{
        position: 'absolute', left: '2rem', bottom: '2rem', color: '#fff',
        background: 'rgba(20,40,60,0.35)',
        padding: '0.7rem 2.7rem', borderRadius: 14, fontSize: '2rem', fontWeight: 800
      }}>
      Title Here
      </h1>
    </div>

    {/* Page Content Grid */}
    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', width: '100%', flexWrap: 'wrap', marginTop: '2rem' }}>
      {/* Main Card */}
      <section style={{
        background: '#fff', borderRadius: 16, boxShadow: '0 2px 10px rgba(46,97,156,0.07)',
        flex: '1 0 540px', maxWidth: 560, minWidth: 340, padding: '1.5rem'
      }}>
        {/* Carousel Placeholder */}
        <div>
          {/* Use a real carousel here */}
          <Image src={property.parsedMedia[0].MediaURL || null} 
          alt="Property" 
          width={500} 
          height={266} 
          style={{ borderRadius: 12, marginBottom: '1.2rem' }}
           />
        </div>
        <div style={{ marginBottom: '1rem', color: '#709cd8', fontWeight: 600 }}>
          18 Broklyn Street, New York
        </div>
        <div style={{ color: '#474d57', fontSize: '1.02rem' }}>
          Spacious modern home, 6 bedrooms, 2 baths, excellent location, pool & media amenities.
        </div>
        <div style={{ margin: '1.2rem 0', borderTop: '1px solid #e5e5e5' }}>
          <h3 className='text-black font-bold mt-5'>Overview</h3>
          <ul style={{ padding: 0, margin: 0, listStyle: 'none', color: '#474d57' }}>
            <li><strong>Type:</strong> 2021</li>
            <li><strong>Build Year:</strong> Yes</li>
            <li><strong>Bed:</strong> {property.BedroomsTotal}</li>
            <li><strong>Bath:</strong> {property.BathroomsTotalInteger}</li>
            <li><strong>Size:</strong> {property.LivingArea} sqft</li>
          </ul>
        </div>
      </section>

      {/* Sidebar Cards */}
      <aside style={{ flex: '1 0 260px', maxWidth: 305, minWidth: 220, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {/* Author Info */}
        <section style={{ background: '#fff', padding: '1.1rem', borderRadius: 14, boxShadow: '0 1px 7px #709cd84c' }}>
          <h4 className='text-black font-bold mb-5' >Author Info</h4>
          <div>
            <span style={{ fontWeight: 600, color: '#417ec7',}}>Sam Jacobson</span><br />
            <a href="mailto:sam@cottage.com" style={{ color: '#417ec7', fontSize: '0.97rem' }}>sam@cottage.com</a>
          </div>
        </section>
        {/* Property Contact */}
        <section style={{ background: '#fff', padding: '1.1rem', borderRadius: 14, boxShadow: '0 1px 7px #709cd84c', marginBottom: '1rem' }}>
          <h4 className='text-black font-bold mb-5'>Property Contact</h4>
          <div>
            <div style={{color: '#417ec7'}}>18 Broklyn Street, New York</div>
            <a href="tel:555-1234" style={{ color: '#417ec7' }}>555-1234</a>
            <br />
            <a href="mailto:info@gravenhurst.com" style={{ color: '#417ec7', fontSize: '0.97rem' }}>info@gravenhurst.com</a>
          </div>
        </section>
      </aside>
    </div>

    {/* Sections: Video, Features, Map, Reviews */}
    <div style={{ maxWidth: 870, margin: '3rem auto', background: '#fff', borderRadius: 18, boxShadow: '0 4px 21px #417ec716', padding: '2rem' }}>
      {/* Preview Video */}
      <section style={{ marginBottom: '2.2rem' }}>
        <h3 className='text-black font-bold'>Preview Video</h3>
        <div style={{ borderRadius: 12, overflow: 'hidden', maxWidth: 600 }}>
          <iframe width="100%" height="340" src="https://www.youtube.com/embed/7d7lQKzvqGo" title="Preview Video" frameBorder="0" allowFullScreen />
        </div>
      </section>

      {/* Features & Amenities */}
      <section style={{ marginBottom: '1.7rem' }}>
        <h3 className='text-black font-bold' >Features & Amenities</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem' }}>
          {features.map(feature => (
            <span key={feature} style={{
              background: '#e5f0fa',
              color: '#417ec7',
              padding: '0.45rem 1rem',
              borderRadius: 8,
              fontWeight: 500,
              fontSize: '0.97rem'
            }}>{feature}</span>
          ))}
        </div>
      </section>

      {/* Location Map */}
      <section style={{ marginBottom: '1.7rem' }}>
        <h3 className='text-black font-bold'>Location</h3>
        <div style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 8px #417ec778' }}>
          <iframe
            width="100%" height="260" frameBorder="0"
            src="https://maps.google.com/maps?q=18%20Broklyn%20Street,%20New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed"
            allowFullScreen
            title="Location Map"
          ></iframe>
        </div>
      </section>

      {/* Review Section */}
      <section>
        <h3 className='text-black font-bold'>Reviews</h3>
        <div style={{ marginBottom: '1.1rem', color: '#aaa' }}>There are no reviews yet.</div>
        <form style={{ background: '#f3f8ff', padding: '1rem', borderRadius: 12 }}>
          <label htmlFor="review" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Leave a Review</label>
          <textarea id="review" rows={4} style={{ width: '100%', borderRadius: 8, border: '1px solid #d6e6f8', padding: '0.7rem', marginBottom: '1rem' }}/>
          <button type="submit" style={{
            background: '#417ec7', color: '#fff', border: 'none', borderRadius: 8,
            padding: '0.65rem 1.6rem', fontWeight: 600, cursor: 'pointer'
          }}>Submit Review</button>
        </form>
      </section>
    </div>

    
  </main>
  );
}
