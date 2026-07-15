import { ShoppingBag, ExternalLink, MessageCircle, ArrowLeft, Heart, Sparkles, Mail, MapPin } from "lucide-react";

interface ShopProps {
  onBack: () => void;
}

const PRODUCTS = [
  {
    id: "dressing-frame",
    name: "Dressing Frame",
    price: "Premium Wooden Material",
    description: "Supports children's independence and fine-motor coordination by teaching real-world skills like buttoning, zipping, buckled straps, and shoe lacing on a high-quality wooden frame with soft fabric panels.",
    link: "https://ksmontessori.com.pk/product/dressing-frame/",
    image: "/src/assets/images/dressing_frame_1783534996686.jpg",
    benefits: ["Fine motor control", "Self-reliance & dressing", "Hand-eye coordination"]
  },
  {
    id: "sound-boxes",
    name: "Sound Boxes",
    price: "Acoustic Auditory Pairings",
    description: "Develops auditory sensitivity, acoustic discrimination, and focus. Includes matching pairs of red-capped and blue-capped wooden sound cylinders that children shake, listen to, and pair by matching volume and timbre.",
    link: "https://ksmontessori.com.pk/product/sound-boxes/",
    image: "/src/assets/images/sound_boxes_1783535018144.jpg",
    benefits: ["Auditory memory", "Sound volume perception", "Sensory attention & focus"]
  },
  {
    id: "touch-tablets",
    name: "Touch Tablets",
    price: "Tactile Texture Mastery",
    description: "Polished wooden tablets with contrasting texture panels ranging from soft, smooth wood to abrasive sandpaper grids. Excellent for developing tactile sensitivity and learning sensory classification.",
    link: "https://ksmontessori.com.pk/product/touch-tablets/",
    image: "/src/assets/images/touch_tablets_1783535033453.jpg",
    benefits: ["Tactile discrimination", "Sensory language (Rough/Smooth)", "Fingertip sensitivity"]
  },
  {
    id: "brown-stairs",
    name: "Brown Stairs (Broad Stair)",
    price: "Classic Dimension Discovery",
    description: "Ten high-quality, solid brown wooden rectangular prisms that vary in thickness. Teaches children visual and physical perception of dimensions, size relationships, sequence ordering, and spatial logic.",
    link: "https://ksmontessori.com.pk/product/brown-stair/",
    image: "/src/assets/images/brown_stairs_1783535052066.jpg",
    benefits: ["Visual size discrimination", "Mathematical sequencing", "Proprioception & balance"]
  }
];

export default function Shop({ onBack }: ShopProps) {
  return (
    <div id="ks-montessori-shop" className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 animate-fadeIn">
      {/* Shop Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between p-6 bg-[#FAF6EE] border border-[#EBE3CE] rounded-[32px] mb-8 shadow-md gap-4">
        <div className="flex items-center gap-4">
          <button
            id="shop-back-btn"
            onClick={onBack}
            className="w-12 h-12 rounded-full bg-white hover:bg-amber-50 text-[#5A6357] border border-[#EBE3CE] flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-xs"
            title="Back to Journeys"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#B5A47C] bg-[#ECE5D3] px-2.5 py-1 rounded-full">
                Partner Store
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles size={10} className="animate-pulse" /> Sensory Approved
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#5C523C] tracking-tight mt-1">KS Montessori Shop</h1>
            <p className="text-xs font-extrabold text-[#8D8268]">Premium Montessori Sensory & Learning Materials</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <a
            id="ks-main-store-btn"
            href="https://share.google/kAFo53cB5a7zyMyIE"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-[#8C9C84] hover:bg-[#7D8C75] text-white font-extrabold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-center select-none"
          >
            <ShoppingBag size={18} />
            <span>Visit Online Store</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </header>

      {/* Intro Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 items-center bg-white/40 backdrop-blur-md p-6 sm:p-8 rounded-[36px] border border-white/50 shadow-sm">
        <div className="md:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800 bg-amber-100/50 px-3 py-1 rounded-full">
            🧩 Montessori Philosophy
          </div>
          <h2 className="text-3xl font-black text-[#5C523C] leading-tight">
            Nurture Your Child's Sensory Development with Genuine Wooden Materials
          </h2>
          <p className="text-[#6B7280] text-base leading-relaxed font-bold">
            Sensory play is the foundation of cognitive development. In cooperation with <strong className="text-[#5C523C]">KS Montessori</strong>, we present these premier tactile, auditory, and visual educational aids that complement our digital sensory journeys. Made from non-toxic natural wood, these physical materials help bridge digital logic with real-world sensory mastery.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {["Natural Wood", "Child-Safe Paints", "AMI Certified Guidelines", "Tactile Focus"].map((tag) => (
              <span key={tag} className="text-xs font-bold text-[#5A6357] bg-white/80 border border-[#E8EDEA] px-3 py-1.5 rounded-full shadow-xs">
                ✨ {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-5">
          <div className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-white aspect-4/3 group">
            <img
              src="/src/assets/images/ks_montessori_contact_1783535068686.jpg"
              alt="KS Montessori Classroom"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
              id="ks-shop-intro-banner-img"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
              <p className="text-white text-xs font-black drop-shadow-md">KS Montessori Early Years Training Environment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Montessori Products Showcase */}
      <div className="mb-12">
        <h3 className="text-2xl font-black text-[#5A6357] mb-6 flex items-center gap-2.5">
          <span className="text-xl">📦</span>
          <span>Featured Sensory Material Boxes</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              id={`shop-product-card-${prod.id}`}
              className="bg-white/70 backdrop-blur-lg border border-white/90 rounded-[32px] p-5 shadow-md flex flex-col justify-between hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300"
            >
              <div>
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#ECE5D3] mb-4 group">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    id={`product-img-${prod.id}`}
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-100 shadow-sm">
                    <span className="text-xs font-black text-amber-800 tracking-tight">{prod.price}</span>
                  </div>
                </div>

                <h4 className="text-2xl font-black text-[#5C523C] mb-2">{prod.name}</h4>
                <p className="text-[#6B7280] text-sm font-bold leading-relaxed mb-4">{prod.description}</p>
                
                <div className="mb-4">
                  <span className="text-[11px] font-black uppercase text-[#8D8268] tracking-wider block mb-2">Developmental Benefits:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {prod.benefits.map((benefit) => (
                      <span key={benefit} className="text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Heart size={10} className="fill-emerald-800" /> {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <a
                id={`buy-btn-${prod.id}`}
                href={prod.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-4 py-3 bg-[#FAF6EE] hover:bg-[#ECE5D3] text-[#5C523C] font-extrabold text-sm rounded-xl border border-[#EBE3CE] transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                <span>View Product Details</span>
                <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Montessori Contact & Community Support */}
      <div id="shop-contact-section" className="bg-[#FAF6EE]/80 border border-[#EBE3CE] rounded-[36px] p-6 sm:p-8 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-[#B5A47C] bg-[#ECE5D3] px-3 py-1 rounded-full">
              Get in Touch
            </span>
            <h3 className="text-3xl font-black text-[#5C523C] leading-tight">
              Connect with AMI Montessori Experts
            </h3>
            <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed font-bold">
              Have questions about how to set up dressing frames, sound boxes, or custom wooden trays for your child? Connect with certified AMI Montessori teachers and the official <strong className="text-[#5C523C]">Kiran Saif (AMI)</strong> network for professional support, guides, and workshops.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <a
                id="contact-instagram-link"
                href="https://www.instagram.com/kiransaif.ami/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white hover:bg-amber-50/50 rounded-2xl border border-[#EBE3CE] flex items-center gap-3 shadow-xs hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-lg">📸</span>
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">Instagram</h5>
                  <p className="font-black text-sm text-[#5C523C]">@kiransaif.ami</p>
                </div>
              </a>

              <a
                id="contact-facebook-link"
                href="https://www.facebook.com/kiransaifami"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white hover:bg-amber-50/50 rounded-2xl border border-[#EBE3CE] flex items-center gap-3 shadow-xs hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-lg">👥</span>
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">Facebook Community</h5>
                  <p className="font-black text-sm text-[#5C523C]">Kiran Saif AMI</p>
                </div>
              </a>
            </div>

            <div className="pt-4 flex flex-wrap gap-4 items-center text-xs font-bold text-[#8D8268]">
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#B5A47C]" /> Pakistan & International Shipping</span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1.5"><Mail size={14} className="text-[#B5A47C]" /> sales@ksmontessori.com.pk</span>
            </div>
          </div>

          {/* Contact Representative details card */}
          <div className="lg:col-span-5 bg-white/90 border border-[#EBE3CE] rounded-3xl p-5 shadow-md text-center">
            <div className="w-20 h-20 bg-amber-50 rounded-full mx-auto flex items-center justify-center mb-3 border border-amber-100 shadow-inner">
              <span className="text-4xl">👩‍🏫</span>
            </div>
            <h4 className="font-black text-lg text-[#5C523C]">Kiran Saif</h4>
            <p className="text-[#B5A47C] text-xs font-extrabold mb-4 uppercase tracking-widest">Founder & Certified AMI Trainer</p>
            
            <p className="text-[#6B7280] text-xs leading-relaxed font-bold mb-6">
              "We provide standard AMI designed wooden sensory materials which enhance concentration, coordinate children's physiological senses, and establish developmental equilibrium."
            </p>

            <a
              id="shop-contact-general-btn"
              href="https://share.google/kAFo53cB5a7zyMyIE"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#5C523C] hover:bg-[#4E4532] text-white font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
            >
              <MessageCircle size={16} />
              <span>Contact Store Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
