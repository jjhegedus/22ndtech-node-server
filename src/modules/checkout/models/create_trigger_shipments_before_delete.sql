delimiter //

create trigger shipments_before_delete before delete on shipments
    for each row 
    begin
        insert into shipment_history
        (
            order_number,
            first_name,
            last_name,
            company,
            address1,
            address2,
            address3,
            address4,
            city,
            state,
            zip_code,
            country,
            email,
            phone,
            mail_class,
            cart_items,
            shipment_dtm,
            create_dtm
        )
        VALUES
        (
            old.order_number,
            old.first_name,
            old.last_name,
            old.company,
            old.address1,
            old.address2,
            old.address3,
            old.address4,
            old.city,
            old.state,
            old.zip_code,
            old.country,
            old.email,
            old.phone,
            old.mail_class,
            old.cart_items,
            old.shipment_dtm,
            old.create_dtm
        );
end //

delimiter ;