delimiter $$

create procedure delete_printed()
begin
    delete from shipments 
    where order_number in (
        select order_number from post_back);
end $$

delimiter ;