## type
Form item type. It can be one of these: 
1. select
2. input

Default: input

## options
If field type is select, then options can not be null.
Options can be String or Array.

### String
If options is String, it will execute miscellaneous.js relative action.
Don't forget to initial options value with pageLib.setPageConfig init argument.

## valueType
When querying db or render component it will adjust value associate with this argument.

1. string
2. number
3. bit (This is only can be use with select type.)