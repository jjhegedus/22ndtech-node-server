DELIMITER $$

DROP PROCEDURE IF EXISTS `debug_insert` $$
CREATE PROCEDURE `debug_insert`(in p_proc_id varchar(100),in p_debug_info text)
begin
  insert into debug (proc_id,debug_output)
  values (p_proc_id,p_debug_info);
end $$

DROP PROCEDURE IF EXISTS `debug_on` $$
CREATE PROCEDURE `debug_on`(in p_proc_id varchar(100))
begin
  call debug_insert(p_proc_id,concat('Debug Started :',now()));
end $$

DROP PROCEDURE IF EXISTS `debug_off` $$
CREATE PROCEDURE `debug_off`(in p_proc_id varchar(100))
begin
  call debug_insert(p_proc_id,concat('Debug Ended :',now()));
  select debug_output from debug where proc_id = p_proc_id order by line_id;
  delete from debug where proc_id = p_proc_id;
end $$

delimiter ;