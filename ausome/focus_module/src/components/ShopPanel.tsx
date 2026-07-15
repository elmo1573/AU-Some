import React from "react";
import { ShoppingBag, ExternalLink, Instagram, Facebook, ArrowLeft, Sparkles, Mail } from "lucide-react";

// Image imports (using the high-quality assets we generated)
// @ts-ignore
import metalInsetsImg from "../assets/images/metal_insets_1783488703331.jpg";
// @ts-ignore
import paperBoardImg from "../assets/images/paper_board_1783488722409.jpg";
// @ts-ignore
import constructiveTrianglesImg from "../assets/images/constructive_triangles_1783488742086.jpg";
// @ts-ignore
import ksLogoImg from "../assets/images/ks_montessori_logo_1783488761872.jpg";
// @ts-ignore
import contactBannerImg from "../assets/images/contact_info_1783488777350.jpg";

interface ShopPanelProps {
  onClose: () => void;
}

export default function ShopPanel({ onClose }: ShopPanelProps) {
  const products = [
    {
      name: "Metal Insets (Metal Insects)",
      subtitle: "With Wooden Stand",
      url: "https://ksmontessori.com.pk/product/metal-insets-with-stand/",
      image: metalInsetsImg,
      description: "AMI standard design featuring beautiful red metal frames holding precise blue geometric inserts (circles, squares, triangles) to practice steady pencil grip and geometric focus.",
      accent: "border-rose-200 bg-rose-50/40 text-rose-800"
    },
    {
      name: "Paper Board for Metal Inset",
      subtitle: "Wooden Inset Paper Holder",
      url: "https://ksmontessori.com.pk/product/paper-board-for-metal-inset/",
      image: paperBoardImg,
      description: "A specially crafted wooden tray to organize and hold paper sheets perfectly under the metal inset templates, allowing children to draw matching shapes cleanly.",
      accent: "border-sky-200 bg-sky-50/40 text-sky-800"
    },
    {
      name: "Constructive Triangles",
      subtitle: "Multi-Box Geometric Set",
      url: "https://ksmontessori.com.pk/product/constructive-triangles/",
      image: constructiveTrianglesImg,
      description: "A wonderful set of wooden trays (hexagonal, rectangular, triangular) containing colorful triangles with clear black lines, guiding focus as kids construct new visual shapes.",
      accent: "border-amber-200 bg-amber-50/40 text-amber-800"
    }
  ];

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 md:p-6 space-y-6 animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-muted-lavender/20 pb-4">
        <button
          onClick={onClose}
          className="flex items-center space-x-1.5 px-4 py-2 bg-warm-cream hover:bg-muted-lavender/10 text-muted-lavender font-bold text-sm rounded-xl border-2 border-muted-lavender cursor-pointer transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Map</span>
        </button>
        
        <div className="text-center">
          <span className="text-xs uppercase font-black tracking-wider text-muted-lavender/60">Montessori Store</span>
          <h2 className="text-2xl font-black text-muted-lavender flex items-center gap-1.5 justify-center">
            <ShoppingBag className="w-5 h-5 text-[#88701B]" />
            <span>Physical Learning Toys</span>
          </h2>
        </div>

        <div className="w-24 hidden md:block"></div> {/* Balanced spacer */}
      </div>

      {/* Intro Hero banner */}
      <div className="bg-[#FEF6C7] border-4 border-[#FAD76C] rounded-3xl p-6 md:p-8 text-center space-y-3 shadow-md relative overflow-hidden">
        <div className="absolute top-2 right-2 opacity-10">
          <ShoppingBag className="w-32 h-32 rotate-12" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF1B1] text-[#8C761D] font-black text-xs border border-[#F5E282]">
          <Sparkles className="w-3 h-3 animate-pulse" />
          <span>Brings the Digital App into Real Life!</span>
        </div>
        <h3 className="text-3xl font-black text-[#5C4A00] tracking-tight">
          Want to buy the games physically?
        </h3>
        <p className="text-[#6B5A10] font-medium text-sm max-w-2xl mx-auto leading-relaxed">
          Enhance your child's sensory, visual, and tactile memory! You can order the exact physical premium wooden materials that inspired this digital focus matching game directly from the official AMI certified manufacturer.
        </p>
      </div>

      {/* Grid of physical products */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product, idx) => (
          <div 
            key={idx}
            className="bg-warm-cream rounded-3xl border-4 border-muted-lavender/60 overflow-hidden flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 shadow-sm"
          >
            <div>
              {/* Product Image */}
              <div className="relative aspect-[4/3] w-full bg-slate-50 border-b-2 border-muted-lavender/40 overflow-hidden group">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className={`absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full border shadow-sm ${product.accent}`}>
                  {product.subtitle}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-2">
                <h4 className="text-lg font-black text-muted-lavender leading-tight">
                  {product.name}
                </h4>
                <p className="text-xs text-muted-lavender/80 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Buy button */}
            <div className="p-5 pt-0">
              <a 
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-soft-green hover:bg-soft-green/90 text-muted-lavender border-2 border-muted-lavender font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <span>Order Physical Game</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Website & Social Media Box section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Box for overall website */}
        <div className="bg-warm-cream rounded-3xl border-4 border-muted-lavender/60 p-6 flex flex-col md:flex-row gap-5 items-center justify-between shadow-sm">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-muted-lavender/40 flex-shrink-0 bg-white p-1">
            <img 
              src={ksLogoImg} 
              alt="KS Montessori Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h4 className="text-lg font-black text-muted-lavender">KS Montessori Official Store</h4>
            <p className="text-xs text-muted-lavender/80 leading-relaxed font-medium">
              Explore hundreds of Premium Montessori wooden toys, math tools, sensory tables, and spatial learning kits handcrafted with baby-safe materials.
            </p>
            <div className="pt-1">
              <a 
                href="https://ksmontessori.com.pk/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FEF6C7] hover:bg-[#FAF1B1] border-2 border-[#F9E684] text-[#4D4315] font-black text-xs rounded-xl transition-all active:scale-95 shadow-sm"
              >
                <span>Visit Main Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Social connections panel */}
        <div className="bg-[#F0F6EF] rounded-3xl border-4 border-[#7AA676] p-6 flex flex-col justify-center space-y-4 shadow-sm text-center">
          <div>
            <h4 className="text-lg font-black text-[#3D543B]">Follow Montessori Community</h4>
            <p className="text-xs text-[#526B50] font-medium mt-1">
              Stay connected with daily sensory play tips, educational guidance, and fresh catalog launches!
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <a 
              href="https://www.instagram.com/kiransaif.ami/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-white border-2 border-[#7AA676] hover:bg-[#7AA676]/10 text-[#3D543B] font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <Instagram className="w-4 h-4 text-pink-600" />
              <span>Instagram</span>
            </a>
            
            <a 
              href="https://www.facebook.com/kiransaifami"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-white border-2 border-[#7AA676] hover:bg-[#7AA676]/10 text-[#3D543B] font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <Facebook className="w-4 h-4 text-blue-600" />
              <span>Facebook</span>
            </a>
          </div>
        </div>

      </div>

      {/* End Contact card image section */}
      <div className="bg-warm-cream rounded-3xl border-4 border-muted-lavender/60 overflow-hidden shadow-sm">
        <div className="p-5 border-b-2 border-muted-lavender/40 text-center">
          <h4 className="text-lg font-black text-muted-lavender">Direct Ordering & Customer Support</h4>
          <p className="text-xs text-muted-lavender/70 font-medium">Have customized requirements or questions? Speak directly with Kiran Saif (AMI Certified Practitioner).</p>
        </div>
        
        {/* Double layout: Beautiful product photo / contact banner */}
        <div className="flex flex-col md:flex-row items-center bg-slate-50">
          <div className="w-full md:w-1/2 p-2 max-h-60 overflow-hidden flex items-center justify-center">
            <img 
              src={contactBannerImg} 
              alt="KS Montessori Contact Card" 
              className="max-h-56 max-w-full rounded-2xl border-2 border-muted-lavender shadow-sm object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="w-full md:w-1/2 p-6 md:p-8 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-100 text-sky-800 rounded-full">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-muted-lavender/60">Email Address</span>
                  <span className="text-sm font-black text-muted-lavender">kiransaifami@gmail.com</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-muted-lavender/70 font-bold bg-[#FEF6C7] p-3 rounded-xl border border-[#FAF1B1] leading-normal">
              💡 <strong>Pro Tip:</strong> Mention this digital <strong>Matching Quest</strong> app to get priority counseling for custom play setups!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
