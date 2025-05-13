CREATE TABLE subtitles (
    id SERIAL PRIMARY KEY,
    clip_id INTEGER NOT NULL REFERENCES clips(id) ON DELETE CASCADE,
    locale VARCHAR(10) NOT NULL,
    content TEXT NOT NULL,
    editable BOOLEAN DEFAULT FALSE,
    start_time INTEGER NOT NULL,
    end_time INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_subtitles_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subtitles_updated_at
BEFORE UPDATE ON subtitles
FOR EACH ROW
EXECUTE FUNCTION update_subtitles_updated_at_column();

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    1,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    5000,
    9000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    2,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    0,
    4500
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    3,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    12000,
    13500
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    4,
    'fr',
    'Qu''est-ce que c''est ?',
    FALSE,
    1000,
    2000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    4,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    2050,
    6000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    5,
    'fr',
    'Et maintenant, voici les détails',
    FALSE,
    0,
    5000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    5,
    'fr',
    'Je vous en prie, allez droit au but',
    FALSE,
    5500,
    7800
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    5,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    8000,
    15000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    6,
    'fr',
    'Dis-lui',
    FALSE,
    0,
    1500
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    6,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    3000,
    10500
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    6,
    'fr',
    'D''accord',
    FALSE,
    11000,
    12500
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    7,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    0,
    3000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    8,
    'fr',
    'Et maintenant, je vais te révéler un secret',
    FALSE,
    0,
    4000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    8,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    4500,
    8000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    9,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    1000,
    4500
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    10,
    'fr',
    'Mon dieu, j''ai déjà gouté meilleur',
    FALSE,
    9000,
    12000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    10,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    13000,
    16000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    11,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    0,
    4000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    12,
    'fr',
    'Dépéchez-vous, c''est une cabine publique',
    FALSE,
    1000,
    4000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    12,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    4500,
    8500
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    13,
    'fr',
    'Docteur, qu''est-ce que ça signifie, je ne comprends pas',
    FALSE,
    1000,
    5000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    13,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    6000,
    8000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    14,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    17000,
    18900
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    15,
    'fr',
    'Qu''est-ce que tu veux dire ?',
    FALSE,
    0,
    2000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    15,
    'fr',
    'C''est pourtant clair',
    FALSE,
    2100,
    4000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    15,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    4500,
    10500
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    16,
    'fr',
    'Ça me semble honnête, explique-nous',
    FALSE,
    0,
    2000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    16,
    'fr',
    'Dans ce cas, allons-y',
    FALSE,
    2500,
    5000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    16,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    7000,
    9800
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    17,
    'fr',
    'T''es rigolo toi !',
    FALSE,
    5000,
    7000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    17,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    7500,
    11000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    18,
    'fr',
    'Qu''il est mignon !',
    FALSE,
    1500,
    3000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    18,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    3500,
    10000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    19,
    'fr',
    'S''il te plaît... Dis-moi quelque chose',
    FALSE,
    0,
    5000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    19,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    9000,
    10500
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    19,
    'fr',
    'Merci',
    FALSE,
    11000,
    12500
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    20,
    'fr',
    'Allez-y !',
    FALSE,
    0,
    1500
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    20,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    9000,
    14000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    20,
    'fr',
    'T''as entendu ça ?',
    FALSE,
    14500,
    16000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    21,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    1500,
    7000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    22,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    9500,
    11800
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    22,
    'fr',
    'Maman !',
    FALSE,
    12500,
    13500
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    23,
    'fr',
    'Dis leur quelque chose',
    FALSE,
    400,
    1800
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    23,
    'fr',
    'D''accord',
    FALSE,
    2000,
    3000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    23,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    5000,
    7500
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    23,
    'fr',
    'Mais qu''est-ce que tu racontes ! Sors d''ici !',
    FALSE,
    7800,
    10500
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    24,
    'fr',
    'Qu''est ce qui s''est passé ?',
    FALSE,
    2600,
    4000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    24,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    4100,
    9500
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    25,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    1500,
    5000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    25,
    'fr',
    'Ah d''accord',
    FALSE,
    5500,
    7000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    26,
    'fr',
    'Je suis là',
    FALSE,
    500,
    1500
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    26,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    4200,
    10500
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    27,
    'fr',
    'Qu''est ce que je vais en faire...',
    FALSE,
    5000,
    7000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    27,
    'fr',
    'Je sais !',
    FALSE,
    9000,
    10000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    27,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    10100,
    13500
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    28,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    8000,
    13000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    29,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    7500,
    9800
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    29,
    'fr',
    'C''est pas faux',
    FALSE,
    10000,
    12000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    30,
    'fr',
    'Santé !',
    FALSE,
    1000,
    2000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    30,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    12000,
    15000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    31,
    'fr',
    'Si mes calculs sont bons... C''est aujourd''hui !',
    FALSE,
    1000,
    4000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    31,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    5000,
    10000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    31,
    'fr',
    'Oh non',
    FALSE,
    10500,
    12000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    32,
    'fr',
    'Bonjour',
    FALSE,
    0,
    1000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    32,
    'fr',
    'Pouvez-vous m''aider ?',
    FALSE,
    2000,
    3800
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    32,
    'fr',
    'On ne peut pas.',
    FALSE,
    4000,
    5000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    32,
    'fr',
    'Vous ne pouvez pas ?',
    FALSE,
    6000,
    7000
);

INSERT INTO subtitles (
    clip_id,
    locale,
    content,
    editable,
    start_time,
    end_time
) VALUES (
    32,
    'fr',
    'Écrivez votre texte ici',
    TRUE,
    8000,
    10000
);