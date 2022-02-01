create or replace function verify_file_url()
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

create trigger max_notion
	before insert or update on file
	for each row 
	execute function verify_file_url();