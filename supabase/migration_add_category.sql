-- Migrazione da eseguire UNA VOLTA nell'SQL Editor del progetto Supabase
-- già esistente, per aggiungere le categorie ai libri già inseriti.
-- (Non serve se crei un progetto Supabase nuovo: schema.sql è già aggiornato.)

alter table books add column if not exists category text;

update books set category = v.category
from (values
  ('Il ladro di neve', 'Storie di Natale e d''Inverno'),
  ('La letterina di Lupo a Babbo Natale', 'Storie di Natale e d''Inverno'),
  ('Ho davvero visto uno Yeti', 'Storie di Natale e d''Inverno'),
  ('Babbo Natale l''ha fatta grossa', 'Storie di Natale e d''Inverno'),
  ('L''infanzia di Babbo Natale', 'Storie di Natale e d''Inverno'),
  ('Il primo Natale di Babbo Natale', 'Storie di Natale e d''Inverno'),
  ('Mimi la piccola renna', 'Storie di Natale e d''Inverno'),
  ('La cena di Natale', 'Storie di Natale e d''Inverno'),
  ('Aldo e la neve (Libro in CAA)', 'Storie di Natale e d''Inverno'),
  ('Il ladro di zucche', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Quel fiore è mio', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Il ladro di sole', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Le caramelle magiche', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Hai visto l''elefante?', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Un rinoceronte al Polo Nord', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Non schiacciate quel bottone!', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Il trattore della nonna', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Un posto segretissimo', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Il grande libro dei pisolini', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Helvis e Otto: L''amicizia vince', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Decidi sempre tu', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Non l''ho fatto apposta', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Due a me, uno a te', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Un coniglietto molto ubbediente', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Se ti dessi mezza mela', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Gatto nero, gatta bianca', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('L''aeroplano blu', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Raccontami una storia', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Ho un sasso nella scarpa', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Ho un buco nel calzino', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Non tutte le principesse...', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Nel paese delle pulcette', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Che cos''è un bambino', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Certe volte', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('La grande fabbrica delle parole', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Posso giocare?', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Le regine litigiose', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Flon-Flon e Musetta', 'Amicizia, Emozioni e Piccole Scoperte'),
  ('Brown Bear, Brown Bear, What Do You See?', 'English Corner (English Books)'),
  ('Room on the Broom', 'English Corner (English Books)'),
  ('From Head to Toe', 'English Corner (English Books)'),
  ('Stick Man', 'English Corner (English Books)'),
  ('Press Here', 'English Corner (English Books)'),
  ('Winter: A Pop-up Book', 'English Corner (English Books)')
) as v(title, category)
where books.title = v.title;
