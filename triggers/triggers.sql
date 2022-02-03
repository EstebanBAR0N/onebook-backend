-- check if inserted / updated file comming from my cloudinary
create or replace function check_file_url()
returns trigger 
as 
'
	declare

	begin
		if new.url not like ''https://res.cloudinary.com/dpxlmevm0%'' then
			raise exception ''URL non conforme !'';	
			return old;
		end if;
	
		return new;
	end;
'  LANGUAGE PLPGSQL;

create trigger check_file_url_trigger
	before insert or update on file
	for each row 
	execute function check_file_url();


-- check if username and email are unique on insert or update user
create or replace function check_unique_attributs()
returns trigger 
as 
'
	declare
	u record;

	begin
		FOR u IN (SELECT * FROM "user")
	    LOOP
	    	if new.email = u.email or new.username = u.username then
          raise exception ''email or username already exist'';
          return old;
			  end if;
	    END LOOP;
		return new;
	end;
'  LANGUAGE PLPGSQL;

create trigger check_unique_attributs_trigger
	before insert or update on "user"
	for each row 
	execute function check_unique_attributs();