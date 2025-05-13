CREATE TABLE clips (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    locale VARCHAR(10) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    skip_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_clips_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clips_updated_at
BEFORE UPDATE ON clips
FOR EACH ROW
EXECUTE FUNCTION update_clips_updated_at_column();

INSERT INTO clips (filename, locale) VALUES ('private_ivan_1', 'ru');
INSERT INTO clips (filename, locale) VALUES ('private_ivan_2', 'ru');
INSERT INTO clips (filename, locale) VALUES ('private_ivan_3', 'ru');
INSERT INTO clips (filename, locale) VALUES ('private_ivan_4', 'ru');
INSERT INTO clips (filename, locale) VALUES ('private_ivan_5', 'ru');
INSERT INTO clips (filename, locale) VALUES ('private_ivan_6', 'ru');
INSERT INTO clips (filename, locale) VALUES ('sampo_1', 'ru');
INSERT INTO clips (filename, locale) VALUES ('sampo_2', 'ru');
INSERT INTO clips (filename, locale) VALUES ('sampo_3', 'ru');
INSERT INTO clips (filename, locale) VALUES ('sampo_4', 'ru');
INSERT INTO clips (filename, locale) VALUES ('sampo_5', 'ru');
INSERT INTO clips (filename, locale) VALUES ('a_groom_from_the_other_world_1', 'ru');
INSERT INTO clips (filename, locale) VALUES ('a_groom_from_the_other_world_2', 'ru');
INSERT INTO clips (filename, locale) VALUES ('the_magic_weaver_1', 'ru');
INSERT INTO clips (filename, locale) VALUES ('the_magic_weaver_2', 'ru');
INSERT INTO clips (filename, locale) VALUES ('the_magic_weaver_3', 'ru');
INSERT INTO clips (filename, locale) VALUES ('the_magic_weaver_4', 'ru');
INSERT INTO clips (filename, locale) VALUES ('the_magic_weaver_5', 'ru');
INSERT INTO clips (filename, locale) VALUES ('the_magic_weaver_6', 'ru');
INSERT INTO clips (filename, locale) VALUES ('the_magic_weaver_7', 'ru');
INSERT INTO clips (filename, locale) VALUES ('the_magic_weaver_8', 'ru');
INSERT INTO clips (filename, locale) VALUES ('the_magic_weaver_9', 'ru');
INSERT INTO clips (filename, locale) VALUES ('kabutack_1', 'jp');
INSERT INTO clips (filename, locale) VALUES ('kabutack_2', 'jp');
INSERT INTO clips (filename, locale) VALUES ('kabutack_3', 'jp');
INSERT INTO clips (filename, locale) VALUES ('poitrine_1', 'jp');
INSERT INTO clips (filename, locale) VALUES ('poitrine_2', 'jp');
INSERT INTO clips (filename, locale) VALUES ('poitrine_3', 'jp');
INSERT INTO clips (filename, locale) VALUES ('poitrine_4', 'jp');
INSERT INTO clips (filename, locale) VALUES ('poitrine_5', 'jp');
INSERT INTO clips (filename, locale) VALUES ('poitrine_6', 'jp');
INSERT INTO clips (filename, locale) VALUES ('poitrine_7', 'jp');