"use client";

import "./magic-bento.css";

interface BentoCard {
  title: string;
  description: string;
  label: string;
}

interface MagicBentoProps {
  cards: BentoCard[];
}

const MagicBento = ({ cards }: MagicBentoProps) => {
  return (
    <div className="card-grid bento-section">
      {cards.map((card, index) => (
        <div key={index} className="magic-bento-card">
          <div className="magic-bento-card__header">
            <div className="magic-bento-card__label">{card.label}</div>
          </div>
          <div className="magic-bento-card__content">
            <h2 className="magic-bento-card__title">{card.title}</h2>
            <p className="magic-bento-card__description">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MagicBento;
