import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Shield, Sparkles } from 'lucide-react';
import { useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/chat');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary fill-primary" />
            <h1 className="text-xl font-semibold text-foreground">HealthMate AI</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Your Personal AI Health Assistant
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get instant, intelligent health guidance powered by advanced AI. 
            Available 24/7 to answer your wellness questions and provide personalized support.
          </p>
          <Button size="lg" onClick={() => navigate('/signup')} className="text-lg px-8 py-6">
            Start Your Journey
          </Button>
        </section>

        <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card p-6 rounded-2xl border border-border text-center">
            <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Smart Conversations</h3>
            <p className="text-muted-foreground">
              Chat naturally with our AI assistant trained on health and wellness topics.
            </p>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border text-center">
            <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Personalized Advice</h3>
            <p className="text-muted-foreground">
              Receive tailored health recommendations based on your specific questions.
            </p>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border text-center">
            <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Private & Secure</h3>
            <p className="text-muted-foreground">
              Your health information is protected with enterprise-grade security.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
