import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Crown, 
  Star, 
  Zap, 
  Shield, 
  Bell, 
  BarChart3, 
  Users, 
  Gift,
  Check,
  X,
  Sparkles
} from 'lucide-react';

interface PremiumPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  features: string[];
  popular?: boolean;
  color: string;
  icon: React.ComponentType<any>;
}

export default function PremiumFeatures() {
  const { user } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);

  const plans: PremiumPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: isYearly ? 99 : 9.99,
      period: isYearly ? 'year' : 'month',
      features: [
        'Приоритетные уведомления',
        'Расширенная статистика',
        'Эксклюзивные аирдропы (до 5)',
        'Техподдержка 24/7',
        'Без рекламы'
      ],
      color: 'from-blue-500 to-cyan-600',
      icon: Star
    },
    {
      id: 'pro',
      name: 'Pro',
      price: isYearly ? 199 : 19.99,
      period: isYearly ? 'year' : 'month',
      features: [
        'Все функции Basic',
        'Неограниченные эксклюзивные аирдропы',
        'Персональный менеджер',
        'Ранний доступ к новым функциям',
        'Аналитика в реальном времени',
        'Автоматическое выполнение задач'
      ],
      popular: true,
      color: 'from-purple-500 to-pink-600',
      icon: Crown
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: isYearly ? 499 : 49.99,
      period: isYearly ? 'year' : 'month',
      features: [
        'Все функции Pro',
        'Белый лейбл решение',
        'API доступ',
        'Кастомная интеграция',
        'Персональная поддержка',
        'Корпоративная аналитика'
      ],
      color: 'from-emerald-500 to-teal-600',
      icon: Shield
    }
  ];

  const premiumFeatures = [
    {
      icon: Bell,
      title: 'Приоритетные уведомления',
      description: 'Получайте уведомления о новых аирдропах первыми',
      color: 'text-blue-400'
    },
    {
      icon: BarChart3,
      title: 'Расширенная аналитика',
      description: 'Подробная статистика и прогнозы доходности',
      color: 'text-purple-400'
    },
    {
      icon: Gift,
      title: 'Эксклюзивные аирдропы',
      description: 'Доступ к закрытым аирдропам только для VIP',
      color: 'text-emerald-400'
    },
    {
      icon: Users,
      title: 'Персональный менеджер',
      description: 'Индивидуальная поддержка и консультации',
      color: 'text-yellow-400'
    },
    {
      icon: Zap,
      title: 'Автоматизация',
      description: 'Автоматическое выполнение простых задач',
      color: 'text-cyan-400'
    },
    {
      icon: Shield,
      title: 'Приоритетная поддержка',
      description: 'Техподдержка 24/7 с приоритетом',
      color: 'text-red-400'
    }
  ];

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    // Здесь будет интеграция с платежной системой
    alert(`Подписка на план ${plans.find(p => p.id === planId)?.name} будет доступна в следующем обновлении!`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl mb-6 shadow-2xl shadow-purple-500/25">
          <Crown className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Премиум возможности
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Получите максимум от платформы с эксклюзивными функциями и приоритетным доступом
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-2">
          <div className="flex items-center space-x-4">
            <span className={`text-sm font-medium ${!isYearly ? 'text-white' : 'text-slate-400'}`}>
              Месячно
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
                isYearly ? 'bg-gradient-to-r from-purple-500 to-blue-600' : 'bg-slate-600'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                isYearly ? 'translate-x-8' : 'translate-x-1'
              }`} />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-white' : 'text-slate-400'}`}>
              Годовая
            </span>
            {isYearly && (
              <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                Скидка 20%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 transition-all duration-300 hover:scale-105 ${
              plan.popular ? 'ring-2 ring-purple-500/50 shadow-2xl shadow-purple-500/20' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Популярный</span>
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl mb-4`}>
                <plan.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center space-x-1">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-slate-400">/{plan.period === 'month' ? 'мес' : 'год'}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id)}
              className={`w-full py-4 rounded-2xl font-semibold transition-all duration-200 ${
                plan.popular
                  ? `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg hover:shadow-purple-500/25`
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
            >
              Выбрать план
            </button>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          Что вы получите с премиум подпиской
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premiumFeatures.map((feature, index) => (
            <div key={index} className="bg-slate-700/30 rounded-2xl p-6 hover:bg-slate-700/50 transition-colors">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-600/50 mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          Часто задаваемые вопросы
        </h2>
        
        <div className="space-y-6 max-w-3xl mx-auto">
          {[
            {
              question: 'Можно ли отменить подписку в любое время?',
              answer: 'Да, вы можете отменить подписку в любое время. Доступ к премиум функциям сохранится до конца оплаченного периода.'
            },
            {
              question: 'Есть ли бесплатный пробный период?',
              answer: 'Да, мы предоставляем 7-дневный бесплатный пробный период для всех новых пользователей премиум планов.'
            },
            {
              question: 'Какие способы оплаты принимаются?',
              answer: 'Мы принимаем все основные банковские карты, PayPal, а также криптовалютные платежи.'
            },
            {
              question: 'Можно ли изменить план в любое время?',
              answer: 'Да, вы можете повысить или понизить свой план в любое время. Изменения вступят в силу немедленно.'
            }
          ].map((faq, index) => (
            <div key={index} className="border-b border-slate-700/50 pb-6 last:border-b-0">
              <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
              <p className="text-slate-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-emerald-500/10 border border-purple-500/20 rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Готовы начать зарабатывать больше?
        </h2>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Присоединяйтесь к тысячам пользователей, которые уже получают максимум от наших премиум функций
        </p>
        <button
          onClick={() => handleSubscribe('pro')}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-purple-500/25"
        >
          Начать бесплатный пробный период
        </button>
      </div>
    </div>
  );
}