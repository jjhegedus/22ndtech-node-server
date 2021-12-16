delimiter $$

create trigger post_back_after_insert after insert on post_back
    for each row 
    begin
        call delete_printed();
    end $$

delimiter ;