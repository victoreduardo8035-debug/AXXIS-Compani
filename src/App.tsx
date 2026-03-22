/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  ArrowRight, 
  TrendingUp, 
  Target, 
  Award, 
  Users, 
  ChevronDown, 
  Menu, 
  X,
  Phone,
  Mail,
  Instagram,
  Linkedin,
  ShoppingBag,
  Sparkles,
  Zap,
  Layers,
  Loader2
} from 'lucide-react';
import { cn } from './lib/utils';
import { generateSalesPitch } from './services/gemini';
import { ConsultancyModal } from './components/ConsultancyModal';

const WHATSAPP_NUMBER = "5595984003262"; 
const WHATSAPP_MESSAGE = "Olá! Gostaria de saber mais sobre a Assessoria 360 da AXXIS COMPANI para minha marca de moda.";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [aiPitch, setAiPitch] = useState("");
  const [loadingPitch, setLoadingPitch] = useState(true);
  const [isConsultancyOpen, setIsConsultancyOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const loadPitch = async () => {
      const pitch = await generateSalesPitch("Moda & Branding de Luxo");
      setAiPitch(pitch || "");
      setLoadingPitch(false);
    };
    loadPitch();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsAppRedirect = (customMessage?: string) => {
    const message = customMessage || WHATSAPP_MESSAGE;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const openConsultancy = () => {
    setIsConsultancyOpen(true);
    setIsMenuOpen(false);
  };

  const Logo = () => (
    <div className="flex items-center gap-4 group cursor-pointer">
      <div className="relative w-10 h-10 flex items-center justify-center">
        <div className="absolute inset-0 bg-brand-accent/20 rounded-xl rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>
        <Zap size={20} className="text-brand-accent relative z-10 drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-xl font-black tracking-tighter text-brand-cream group-hover:text-brand-accent group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.5)] transition-all">
          AXXIS
        </span>
        <span className="text-[8px] font-black tracking-[0.4em] text-brand-accent/60 uppercase group-hover:text-brand-accent transition-colors">
          COMPANI
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-accent selection:text-brand-dark">
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-6 py-6",
        scrolled ? "bg-brand-dark/80 backdrop-blur-2xl border-b border-white/5 py-4" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />

          <div className="hidden md:flex items-center gap-12">
            {['O que fazemos', 'Dores', 'Consultoria IA', 'WhatsApp'].map((item) => (
              <a 
                key={item} 
                href={item === 'Consultoria IA' || item === 'WhatsApp' ? '#' : `#${item.toLowerCase().replace(/ /g, '-')}`} 
                onClick={(e) => {
                  if (item === 'Consultoria IA') {
                    e.preventDefault();
                    openConsultancy();
                  } else if (item === 'WhatsApp') {
                    e.preventDefault();
                    handleWhatsAppRedirect();
                  }
                }}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-cream/40 hover:text-brand-accent transition-all duration-300"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => handleWhatsAppRedirect()}
              className="p-4 rounded-full bg-white/5 border border-white/10 text-brand-accent hover:bg-brand-accent hover:text-brand-dark transition-all"
            >
              <MessageCircle size={18} />
            </button>
            <button 
              onClick={openConsultancy}
              className="btn-primary"
            >
              Diagnóstico IA
            </button>
          </div>

          <button className="md:hidden text-brand-cream" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-brand-dark pt-32 px-8 flex flex-col gap-12 md:hidden"
          >
            {['O que fazemos', 'Dores', 'Consultoria IA', 'WhatsApp'].map((item) => (
              <a 
                key={item} 
                href={item === 'Consultoria IA' || item === 'WhatsApp' ? '#' : `#${item.toLowerCase().replace(/ /g, '-')}`} 
                className="text-5xl font-display font-black tracking-tighter uppercase"
                onClick={(e) => {
                  if (item === 'Consultoria IA') {
                    e.preventDefault();
                    openConsultancy();
                    setIsMenuOpen(false);
                  } else if (item === 'WhatsApp') {
                    e.preventDefault();
                    handleWhatsAppRedirect();
                    setIsMenuOpen(false);
                  } else {
                    setIsMenuOpen(false);
                  }
                }}
              >
                {item}
              </a>
            ))}
            <div className="flex flex-col gap-4 mt-auto pb-12">
              <button 
                onClick={() => handleWhatsAppRedirect()}
                className="btn-secondary w-full flex items-center justify-center gap-3"
              >
                <MessageCircle size={20} /> WhatsApp Direto
              </button>
              <button 
                onClick={openConsultancy}
                className="btn-primary w-full flex items-center justify-center gap-3"
              >
                <Sparkles size={20} /> Diagnóstico Gratuito
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="início" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.08),transparent_60%)]"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-[0.07] grayscale"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-transparent to-brand-dark"></div>
        </div>

        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <span className="section-label">Elite Fashion Branding</span>
              <h1 className="title-massive">
                O Futuro <br />
                <span className="text-brand-accent text-editorial lowercase drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">da sua</span> <br />
                Marca de Moda.
              </h1>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="max-w-2xl mx-auto mb-16"
            >
              {loadingPitch ? (
                <div className="flex justify-center gap-3">
                  {[0, 1, 2].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      className="w-1.5 h-1.5 bg-brand-accent rounded-full"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-lg md:text-xl text-brand-cream/40 leading-relaxed font-light tracking-wide">
                  {aiPitch}
                </p>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8"
            >
              <button onClick={openConsultancy} className="btn-primary group">
                Iniciar Diagnóstico <ArrowRight size={14} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => handleWhatsAppRedirect()}
                className="btn-secondary group"
              >
                Falar no WhatsApp <MessageCircle size={14} className="inline ml-2 group-hover:scale-110 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-12 left-12 hidden lg:block">
          <div className="flex flex-col gap-4">
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-brand-accent/50 to-transparent mx-auto"></div>
            <span className="text-[8px] font-black uppercase tracking-[0.5em] vertical-text text-brand-accent/40">Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* Bento Services Section */}
      <section id="o-que-fazemos" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24">
            <span className="section-label">Nossa Expertise</span>
            <h2 className="font-display text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
              Assessoria <br />
              <span className="text-brand-accent text-editorial lowercase">Estratégica</span> 360°
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <motion.div 
              whileHover={{ y: -10 }}
              className="md:col-span-8 bento-item min-h-[400px] relative overflow-hidden group neon-border"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 blur-[100px] group-hover:bg-brand-accent/10 transition-all"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-12 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                  <Layers size={28} className="drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]" />
                </div>
                <h3 className="text-4xl font-display font-black uppercase mb-6">Branding & <br />Identidade de Luxo</h3>
                <p className="text-brand-cream/40 max-w-md leading-relaxed">
                  Construímos universos narrativos que transcendem o produto. Sua marca não apenas vende roupas, ela vende um estilo de vida aspiracional e inesquecível.
                </p>
              </div>
              <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-brand-accent">
                Explorar Metodologia <ArrowRight size={12} />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="md:col-span-4 bento-item min-h-[400px] bg-brand-accent text-brand-dark border-none shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_50px_rgba(212,175,55,0.4)]"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-brand-dark/10 flex items-center justify-center text-brand-dark mb-12">
                  <TrendingUp size={28} />
                </div>
                <h3 className="text-4xl font-display font-black uppercase mb-6">Escala <br />Digital</h3>
                <p className="text-brand-dark/60 leading-relaxed">
                  Tráfego pago e funis de alta conversão desenhados para o mercado premium.
                </p>
              </div>
              <button 
                onClick={openConsultancy}
                className="w-full py-4 bg-brand-dark text-brand-accent rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all"
              >
                Solicitar Plano
              </button>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="md:col-span-4 bento-item min-h-[400px]"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-brand-accent mb-12">
                  <Target size={28} />
                </div>
                <h3 className="text-3xl font-display font-black uppercase mb-6">Sales <br />Enablement</h3>
                <p className="text-brand-cream/40 leading-relaxed">
                  Transformamos vendedores em consultores de luxo através de treinamentos práticos.
                </p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="md:col-span-8 bento-item min-h-[400px] relative overflow-hidden group"
            >
              <div className="absolute inset-0 grayscale opacity-20 group-hover:opacity-40 transition-opacity">
                <img 
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?auto=format&fit=crop&q=80&w=1000" 
                  alt="Fashion" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="relative z-10 mt-auto">
                <h3 className="text-5xl font-display font-black uppercase mb-4">Experiência <br />Omnichannel</h3>
                <p className="text-brand-cream/60 max-w-sm">A união perfeita entre o digital e o físico para um crescimento sustentável.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section id="dores" className="py-32 bg-white/[0.02] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="section-label">O Diagnóstico</span>
              <h2 className="font-display text-6xl md:text-8xl font-black mb-12 tracking-tighter uppercase leading-none">
                O que trava <br />
                <span className="text-brand-accent text-editorial lowercase">seu</span> Sucesso?
              </h2>
              
              <div className="space-y-4">
                {[
                  'Falta de diferenciação clara no mercado saturado',
                  'Baixa conversão apesar do alto investimento em tráfego',
                  'Desconexão entre a experiência física e digital',
                  'Equipe de vendas sem processos de fechamento de luxo'
                ].map((pain, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-6 p-8 rounded-[32px] bg-white/[0.03] border border-white/5 hover:border-brand-accent/30 hover:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0">
                      <X size={16} />
                    </div>
                    <p className="text-brand-cream/60 font-medium text-lg">{pain}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-[48px] overflow-hidden border border-white/10 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1000" 
                  alt="Fashion Strategy" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent"></div>
                <div className="absolute bottom-12 left-12 right-12 glass-card p-10 border-brand-accent/30">
                  <div className="text-6xl font-display font-black text-brand-accent mb-4">87%</div>
                  <p className="text-sm text-brand-cream/60 leading-relaxed uppercase tracking-widest font-black">
                    Das marcas de moda falham por falta de um posicionamento sólido.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultancy Section */}
      <section id="consultoria" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-accent/[0.02]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="section-label">Consultoria Estratégica</span>
            <h2 className="font-display text-6xl md:text-8xl font-black tracking-tighter uppercase mb-8 leading-none">
              Dois Caminhos <br />
              <span className="text-brand-accent text-editorial lowercase">para o</span> Sucesso
            </h2>
            <p className="text-xl text-brand-cream/40 max-w-2xl mx-auto font-light leading-relaxed">
              Escolha entre a agilidade da nossa Inteligência Artificial ou a profundidade de um especialista humano.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* AI Path */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="glass-card p-12 border-brand-accent/20 flex flex-col justify-between hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-10">
                  <Sparkles size={32} />
                </div>
                <h3 className="text-4xl font-display font-black uppercase mb-6">Consultoria <br />Instantânea (IA)</h3>
                <p className="text-brand-cream/40 leading-relaxed mb-10">
                  Diagnóstico estratégico em tempo real. Nossa IA analisa sua marca, identifica gargalos e sugere planos de ação imediatos 24/7.
                </p>
                <div className="space-y-4 mb-12">
                  {['Análise de Branding', 'Funis de Venda', 'Plano de Ação'].map(item => (
                    <div key={item} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-brand-accent">
                      <Zap size={12} /> {item}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={openConsultancy}
                className="btn-primary w-full py-6 text-lg"
              >
                Falar com Consultor IA
              </button>
            </motion.div>

            {/* WhatsApp Path */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="glass-card p-12 border-white/10 flex flex-col justify-between bg-white/[0.02]"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-brand-cream mb-10">
                  <MessageCircle size={32} />
                </div>
                <h3 className="text-4xl font-display font-black uppercase mb-6">Consultoria <br />Humana (WhatsApp)</h3>
                <p className="text-brand-cream/40 leading-relaxed mb-10">
                  Fale diretamente com nossos especialistas. Uma análise profunda e personalizada para marcas que buscam o próximo nível de exclusividade.
                </p>
                <div className="space-y-4 mb-12">
                  {['Mentoria Individual', 'Estratégia Customizada', 'Suporte VIP'].map(item => (
                    <div key={item} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-brand-cream/40">
                      <Users size={12} /> {item}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleWhatsAppRedirect()}
                className="btn-secondary w-full py-6 text-lg border-brand-accent/30 text-brand-accent hover:bg-brand-accent hover:text-brand-dark"
              >
                Falar com Especialista
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-brand-dark pt-32 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
            <div className="col-span-1 md:col-span-1">
              <Logo />
              <p className="text-brand-cream/30 text-[10px] leading-relaxed mt-10 mb-12 uppercase tracking-[0.2em] font-black">
                Elite Marketing & Branding <br />
                Sales Enablement Mentor
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/axxiscompani" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-brand-accent hover:text-brand-dark transition-all border border-white/5"><Instagram size={20} /></a>
                <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-brand-accent hover:text-brand-dark transition-all border border-white/5"><Linkedin size={20} /></a>
              </div>
            </div>

            <div>
              <h4 className="section-label mb-8">Navegação</h4>
              <ul className="space-y-6 text-[10px] font-black uppercase tracking-widest text-brand-cream/40">
                <li><a href="#" className="hover:text-brand-accent transition-colors">Assessoria 360</a></li>
                <li><a href="#" className="hover:text-brand-accent transition-colors">Mentoria de Vendas</a></li>
                <li><a href="#" className="hover:text-brand-accent transition-colors">Cases de Sucesso</a></li>
                <li><a href="#" className="hover:text-brand-accent transition-colors">Metodologia</a></li>
              </ul>
            </div>

            <div>
              <h4 className="section-label mb-8">Recursos</h4>
              <ul className="space-y-6 text-[10px] font-black uppercase tracking-widest text-brand-cream/40">
                <li><a href="#" className="hover:text-brand-accent transition-colors">E-books Gratuitos</a></li>
                <li><a href="#" className="hover:text-brand-accent transition-colors">Blog de Moda</a></li>
                <li><a href="#" className="hover:text-brand-accent transition-colors">Webinars</a></li>
                <li><a href="#" className="hover:text-brand-accent transition-colors">Calculadora ROI</a></li>
              </ul>
            </div>

            <div>
              <h4 className="section-label mb-8">Direct Contact</h4>
              <ul className="space-y-6 text-[10px] font-black uppercase tracking-widest text-brand-cream/40">
                <li 
                  onClick={() => handleWhatsAppRedirect()}
                  className="flex items-center gap-4 hover:text-brand-accent transition-colors cursor-pointer"
                >
                  <MessageCircle size={18} className="text-brand-accent" /> (95) 98400-3262
                </li>
                <li className="flex items-center gap-4 hover:text-brand-accent transition-colors cursor-pointer">
                  <Mail size={18} className="text-brand-accent" /> elite@axxiscompani.com
                </li>
                <li className="flex items-start gap-4">
                  <Target size={18} className="text-brand-accent mt-1 shrink-0" /> São Paulo | Global
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-brand-cream/10">
            <p>© 2026 AXXIS COMPANI. THE ELITE STANDARD.</p>
            <div className="flex gap-12">
              <a href="#" className="hover:text-brand-accent transition-colors">Privacidade</a>
              <a href="#" className="hover:text-brand-accent transition-colors">Termos</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Actions */}
      <div className="fixed bottom-10 right-10 z-50 flex flex-col gap-4">
        {/* AI Consultancy Floating Button */}
          <motion.button
            initial={{ scale: 0, x: 20 }}
            animate={{ scale: 1, x: 0 }}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={openConsultancy}
            className="w-16 h-16 bg-brand-dark/80 backdrop-blur-xl border border-brand-accent/30 text-brand-accent rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)] group relative"
          >
            <Sparkles size={32} className="group-hover:rotate-12 transition-transform drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
          <span className="absolute right-20 bg-brand-dark border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Consultoria IA
          </span>
        </motion.button>

        {/* WhatsApp Floating Button */}
        <motion.button
          initial={{ scale: 0, x: 20 }}
          animate={{ scale: 1, x: 0 }}
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleWhatsAppRedirect()}
          className="w-16 h-16 bg-brand-accent text-brand-dark rounded-2xl flex items-center justify-center shadow-[0_20px_50px_rgba(212,175,55,0.3)] group relative"
        >
          <MessageCircle size={32} className="group-hover:scale-110 transition-transform" />
          <span className="absolute right-20 bg-brand-dark border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none text-brand-cream">
            WhatsApp VIP
          </span>
        </motion.button>
      </div>

      <ConsultancyModal 
        isOpen={isConsultancyOpen} 
        onClose={() => setIsConsultancyOpen(false)} 
        onWhatsApp={(summary) => {
          const message = `Olá! Acabei de realizar uma consultoria com a IA da AXXIS COMPANI. Aqui está o resumo:\n\n${summary}`;
          handleWhatsAppRedirect(message);
        }}
      />
    </div>
  );
}
