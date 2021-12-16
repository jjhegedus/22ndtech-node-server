DROP TABLE IF EXISTS debug;
CREATE TABLE debug (
  proc_id varchar(100) default NULL,
  debug_output text,
  line_id int(11) NOT NULL auto_increment,
  PRIMARY KEY  (line_id)
)