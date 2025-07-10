// src/pages/ExerciseLibrary.jsx
import React, { useState } from 'react';
import './ExerciseLibrary.css';

const ExerciseLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleCard = (exerciseId) => {
    setExpandedCard(expandedCard === exerciseId ? null : exerciseId);
  };

  const exercises = [
    {
      id: 1,
      name: 'Wyciskanie sztangi leżąc',
      category: 'klatka',
      muscle: 'Klatka piersiowa',
      difficulty: 'Średni',
      equipment: 'Sztanga, ławka',
      description: 'Podstawowe ćwiczenie na klatkę piersiową. Leżąc na ławce, wyciskaj sztangę w górę nad klatką piersiową.',
      benefits: 'Buduje masę i siłę klatki piersiowej, przednich naramków i tricepsów',
      technique: [
        'Połóż się na ławce, stopy na podłodze',
        'Chwyć sztangę o szerokości ramion',
        'Opuść sztangę kontrolowanie do klatki',
        'Wciśnij sztangę w górę, wyprostowując ramiona'
      ],
      tips: 'Utrzymuj łopatki ściągnięte, nie odbijaj sztangi od klatki'
    },
    {
      id: 2,
      name: 'Przysiady ze sztangą',
      category: 'nogi',
      muscle: 'Nogi, pośladki',
      difficulty: 'Zaawansowany',
      equipment: 'Sztanga, stojak',
      description: 'Król wszystkich ćwiczeń. Kompleksowe ćwiczenie angażujące całe ciało.',
      benefits: 'Buduje siłę i masę nóg, pośladków, wzmacnia core i plecy',
      technique: [
        'Ustaw sztangę na stojaku na wysokości ramion',
        'Podejdź pod sztangę, oprzyj na trapezach',
        'Stopy na szerokość ramion',
        'Opuść się kontrolowanie, kolana za palce stóp',
        'Wstań z siłą, wypychając biodra do przodu'
      ],
      tips: 'Zachowaj naturalny łuk w plecach, nie patrz w dół'
    },
    {
      id: 3,
      name: 'Martwy ciąg',
      category: 'plecy',
      muscle: 'Plecy, nogi, core',
      difficulty: 'Zaawansowany',
      equipment: 'Sztanga',
      description: 'Fundamentalne ćwiczenie siłowe angażujące łańcuch tylny.',
      benefits: 'Wzmacnia plecy, nogi, pośladki, poprawia postawę',
      technique: [
        'Stań nad sztangą, stopy pod biodrami',
        'Pochyl się i chwyć sztangę',
        'Wyprostuj plecy, napnij core',
        'Wstań, wyprostowując biodra i kolana',
        'Opuść sztangę kontrolowanie'
      ],
      tips: 'Trzymaj sztangę blisko ciała, nie zaokrąglaj pleców'
    },
    {
      id: 4,
      name: 'Wiosłowanie sztangą',
      category: 'plecy',
      muscle: 'Plecy, biceps',
      difficulty: 'Średni',
      equipment: 'Sztanga',
      description: 'Ćwiczenie na szerokie plecy w pochyleniu.',
      benefits: 'Buduje szerokość pleców, wzmacnia tylne naramki',
      technique: [
        'Stań w rozkroku, pochyl tułów',
        'Chwyć sztangę nachwytem',
        'Przyciągnij sztangę do dolnej części klatki',
        'Ściągnij łopatki, napnij plecy',
        'Opuść kontrolowanie'
      ],
      tips: 'Nie używaj rozmachu, kontroluj ruch'
    },
    {
      id: 5,
      name: 'Wyciskanie żołnierskie',
      category: 'ramiona',
      muscle: 'Ramiona, triceps',
      difficulty: 'Średni',
      equipment: 'Sztanga',
      description: 'Wyciskanie sztangi nad głowę ze stania.',
      benefits: 'Buduje siłę i masę ramion, wzmacnia core',
      technique: [
        'Stój prosto, sztanga na wysokości ramion',
        'Chwyć sztangę nieco szerzej od ramion',
        'Wciśnij sztangę nad głowę',
        'Opuść kontrolowanie do pozycji wyjściowej'
      ],
      tips: 'Napnij core, nie wyginaj pleców'
    },
    {
      id: 6,
      name: 'Uginanie ramion ze sztangą',
      category: 'ramiona',
      muscle: 'Biceps',
      difficulty: 'Łatwy',
      equipment: 'Sztanga',
      description: 'Klasyczne ćwiczenie na biceps.',
      benefits: 'Izoluje i buduje biceps',
      technique: [
        'Stój prosto, sztanga w rękach',
        'Łokcie przy ciele',
        'Uginaj ramiona, podnosząc sztangę',
        'Opuść kontrolowanie'
      ],
      tips: 'Nie używaj rozmachu, kontroluj ruch'
    },
    {
      id: 7,
      name: 'Wyciskanie na poręczach',
      category: 'klatka',
      muscle: 'Klatka, triceps',
      difficulty: 'Średni',
      equipment: 'Poręcze',
      description: 'Ćwiczenie na poręczach angażujące klatkę i triceps.',
      benefits: 'Buduje dolną część klatki piersiowej i triceps',
      technique: [
        'Chwyć poręcze, podciągnij się',
        'Pochyl się lekko do przodu',
        'Opuść się kontrolowanie',
        'Wciśnij się do góry'
      ],
      tips: 'Nie opuszczaj się zbyt nisko, kontroluj ruch'
    },
    {
      id: 8,
      name: 'Podciąganie nachwytem',
      category: 'plecy',
      muscle: 'Plecy, biceps',
      difficulty: 'Zaawansowany',
      equipment: 'Drążek',
      description: 'Podciąganie się na drążku nachwytem.',
      benefits: 'Buduje szerokość pleców, wzmacnia biceps',
      technique: [
        'Zwiś na drążku, chwyt szerszy od ramion',
        'Podciągnij się do drążka',
        'Ściągnij łopatki',
        'Opuść się kontrolowanie'
      ],
      tips: 'Nie kiwaj się, kontroluj ruch'
    },
    {
      id: 9,
      name: 'Pompki',
      category: 'klatka',
      muscle: 'Klatka, triceps, ramiona',
      difficulty: 'Łatwy',
      equipment: 'Własne ciało',
      description: 'Podstawowe ćwiczenie z masą własnego ciała.',
      benefits: 'Wzmacnia klatkę, triceps i core',
      technique: [
        'Pozycja deski, ręce pod ramionami',
        'Opuść się do podłogi',
        'Wciśnij się w górę',
        'Utrzymuj proste ciało'
      ],
      tips: 'Nie opuszczaj bioder, kontroluj ruch'
    },
    {
      id: 10,
      name: 'Deska',
      category: 'brzuch',
      muscle: 'Core, brzuch',
      difficulty: 'Łatwy',
      equipment: 'Własne ciało',
      description: 'Statyczne ćwiczenie wzmacniające core.',
      benefits: 'Wzmacnia mięśnie głębokie brzucha i pleców',
      technique: [
        'Pozycja podporu na przedramionach',
        'Ciało w linii prostej',
        'Napnij brzuch',
        'Utrzymuj pozycję'
      ],
      tips: 'Nie podnoś bioder, oddychaj równomiernie'
    },
    {
      id: 11,
      name: 'Wspięcia na palce',
      category: 'nogi',
      muscle: 'Łydki',
      difficulty: 'Łatwy',
      equipment: 'Własne ciało lub obciążenie',
      description: 'Ćwiczenie na mięśnie łydek.',
      benefits: 'Wzmacnia i buduje łydki',
      technique: [
        'Stań prosto, palce na podwyższeniu',
        'Wspinaj się na palce',
        'Opuść się poniżej poziomu',
        'Powtórz ruch'
      ],
      tips: 'Pełen zakres ruchu, kontroluj ruch'
    },
    {
      id: 12,
      name: 'Wykroki',
      category: 'nogi',
      muscle: 'Nogi, pośladki',
      difficulty: 'Średni',
      equipment: 'Własne ciało lub hantle',
      description: 'Ćwiczenie funkcjonalne na nogi.',
      benefits: 'Wzmacnia nogi, poprawia równowagę',
      technique: [
        'Stań prosto',
        'Zrób krok do przodu',
        'Opuść się, kolano do podłogi',
        'Wróć do pozycji stojącej'
      ],
      tips: 'Kolano nie wykracza za palce, kontroluj ruch'
    },
    {
      id: 13,
      name: 'Wznosy ramion w bok',
      category: 'ramiona',
      muscle: 'Ramiona boczne',
      difficulty: 'Łatwy',
      equipment: 'Hantle',
      description: 'Izolacyjne ćwiczenie na boczne naramki.',
      benefits: 'Buduje szerokość ramion',
      technique: [
        'Stój prosto, hantle w rękach',
        'Podnoś ramiona w boki',
        'Do wysokości ramion',
        'Opuść kontrolowanie'
      ],
      tips: 'Nie używaj rozmachu, kontroluj ruch'
    },
    {
      id: 14,
      name: 'Wyciskanie francuskie',
      category: 'ramiona',
      muscle: 'Triceps',
      difficulty: 'Średni',
      equipment: 'Sztanga lub hantle',
      description: 'Ćwiczenie izolujące triceps.',
      benefits: 'Buduje masę tricepsów',
      technique: [
        'Leż na ławce, sztanga nad klatką',
        'Opuść sztangę do czoła',
        'Wciśnij ramiona w górę',
        'Łokcie nieruchome'
      ],
      tips: 'Łokcie nie rozchodzą się, kontroluj ruch'
    },
    {
      id: 15,
      name: 'Brzuszki',
      category: 'brzuch',
      muscle: 'Brzuch',
      difficulty: 'Łatwy',
      equipment: 'Własne ciało',
      description: 'Podstawowe ćwiczenie na brzuch.',
      benefits: 'Wzmacnia górną część brzucha',
      technique: [
        'Leż na plecach, kolana ugięte',
        'Ręce za głową',
        'Podnoś tułów do kolan',
        'Opuść kontrolowanie'
      ],
      tips: 'Nie ciągnij za szyję, kontroluj ruch'
    }
  ];

  const categories = [
    { id: 'all', name: 'Wszystkie' },
    { id: 'klatka', name: 'Klatka piersiowa' },
    { id: 'plecy', name: 'Plecy' },
    { id: 'ramiona', name: 'Ramiona' },
    { id: 'nogi', name: 'Nogi' },
    { id: 'brzuch', name: 'Brzuch' }
  ];

  const filteredExercises = exercises.filter(exercise => {
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Łatwy': return '#4CAF50';
      case 'Średni': return '#FF9800';
      case 'Zaawansowany': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <div className="exercise-library">
      <div className="library-header">
        <h1>🏋️‍♂️ Biblioteka Ćwiczeń</h1>
        <p>Poznaj prawidłową technikę i korzyści z każdego ćwiczenia</p>
      </div>

      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Szukaj ćwiczenia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="exercises-grid">
        {filteredExercises.map(exercise => (
          <div key={exercise.id} className={`exercise-card ${expandedCard === exercise.id ? 'expanded' : ''}`}>
            <div className="exercise-header" onClick={() => toggleCard(exercise.id)}>
              <h3>{exercise.name}</h3>
              <div className="header-right">
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(exercise.difficulty) }}
                >
                  {exercise.difficulty}
                </span>
                <span className={`expand-icon ${expandedCard === exercise.id ? 'rotated' : ''}`}>
                  ▶
                </span>
              </div>
            </div>

            {expandedCard === exercise.id && (
              <div className="exercise-details">
                <button 
                  className="close-button" 
                  onClick={() => toggleCard(exercise.id)}
                  title="Zamknij"
                >
                  ×
                </button>
                
                <div className="exercise-basic-info">
                  <h3 style={{marginBottom: '12px', color: '#2c3e50', fontSize: '1.1rem'}}>{exercise.name}</h3>
                  <div className="info-row">
                    <span className="label">💪 Mięśnie:</span>
                    <span className="value">{exercise.muscle}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">🏗️ Sprzęt:</span>
                    <span className="value">{exercise.equipment}</span>
                  </div>
                </div>

                <div className="exercise-description">
                  <h4>📝 Opis:</h4>
                  <p>{exercise.description}</p>
                </div>

                <div className="exercise-benefits">
                  <h4>✨ Korzyści:</h4>
                  <p>{exercise.benefits}</p>
                </div>

                <div className="exercise-technique">
                  <h4>🎯 Technika wykonania:</h4>
                  <ol>
                    {exercise.technique.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="exercise-tips">
                  <h4>💡 Wskazówki:</h4>
                  <p>{exercise.tips}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="no-results">
          <p>😞 Nie znaleziono ćwiczeń spełniających kryteria wyszukiwania</p>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;
