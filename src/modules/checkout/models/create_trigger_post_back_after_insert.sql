create trigger post_back_after_insert after insert on post_back
    for each row 
    begin
        call 22ndtech.delete_printed();
    end