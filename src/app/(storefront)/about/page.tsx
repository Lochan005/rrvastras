import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about RR Vastras — a women's saree brand offering elegant traditional and contemporary sarees across India.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Our Story</h1>
        <div className="h-1 w-20 bg-gold mx-auto" />
      </div>
      
      <div className="relative h-[400px] w-full mb-12 rounded-sm overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200" 
          alt="RR Vastras Collection" 
          fill 
          className="object-cover"
        />
      </div>

      <div className="space-y-8 text-lg text-muted leading-relaxed max-w-3xl mx-auto">
        <p className="text-xl font-medium text-foreground text-center mb-8">
          RR Vastras is a women&apos;s clothing brand dedicated to the timeless
          elegance of the saree. We curate sarees that celebrate tradition while
          embracing modern sensibilities.
        </p>
        
        <p>
          Every saree in our collection includes a matching blouse piece, so you
          can drape and wear with confidence. From luxurious silks to breathable
          cottons and handloom weaves, we source quality fabrics that drape
          beautifully and feel comfortable.
        </p>
        
        <p>
          Based in India, we ship nationwide. Our team personally handles every
          order — from careful packing to dispatch — ensuring your saree arrives
          in perfect condition.
        </p>
        
        <p>
          Whether you&apos;re building your first saree collection or adding a
          statement piece for a special occasion, RR Vastras is here to help you
          find something truly special.
        </p>
      </div>
    </div>
  );
}
