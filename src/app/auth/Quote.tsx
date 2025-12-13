import Image from 'next/image'

export default function Quote() {
  return (
    <div 
      className="hidden md:flex md:w-1/2 relative p-8" 
      style={{ 
        backgroundImage: 'url(https://images.typeform.com/images/gAqmGWTiyfrT/background/large)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute top-8 left-8">
        <Image
          src="https://storage.googleapis.com/icelandeclipse/the-portal-at-iceland-eclipse-logo.png"
          alt="The Portal at Iceland Eclipse logo"
          width={200}
          height={80}
          priority
        />
      </div>
      {/* TODO: Add quot

      <div className="absolute bottom-8 left-8 text-left pr-8">
        <blockquote className="text-white text-lg font-light italic mb-2">
          "This is a super inspiring quote"
        </blockquote>
        <p className="text-white text-sm">- Tule</p>
      </div>
      
      */}
    </div>
  )
}

