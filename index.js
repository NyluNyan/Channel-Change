module.exports = function ChannelChange(mod) {
	
	let chanx = 0,
	hook = [];
	
	mod.command.add(['ch', '!ch'], (cmd) =>
	{
		switch(cmd)
		{
			case undefined:
				if(hook[0] === undefined)
				{
					hook.push(mod.hook('S_CHAT', 3, (event) =>
					{
						if(event.channel === 1)
						{
							if(event.gameId != mod.game.me.gameId)
							{
								var Chan;
								var Message = event.message.substring(6, event.message.lastIndexOf(">")-6);
								/*var List = Message.split(' ');
								for(var i = 0; i < List.length; i++)
								{
									if(!isNaN(List[i]))
									{
										Chan = Number(List[i])-1;
										i+=1000;
									}
								}
								if(Chan !== (chanx-1)) Channel(Number(Chan));*/
								if(!isNaN(Message))
								{
									Chan = Number(Message)-1;
									if(Chan !== (chanx-1)) Channel(Number(Chan));
								}
							}
						}
					}));
					hook.push(mod.hook('S_ASK_TELEPORT', 1, (event) => 
					{
						mod.toServer('C_REPLY_TELEPORT', 1, {accept: 1});
						return false;
					}));
					mod.command.message('Channel listening enabled');
				}
				else
				{
					mod.unhook(hook[0]);
					mod.unhook(hook[1]);
					hook = [];
					mod.command.message('Channel listening disabled');
				}
				break;
			case '+':
				if(chanx === 20) chanx = 0;
				Channel(Number(chanx));
				break;
			case '-':
				if(chanx === 1) chanx = 21;
				Channel(Number(chanx) - 2);
				break;
			default:
				if((Number(cmd) - 1) !== (chanx-1)) Channel(Number(cmd) - 1);
				break;
		}
				
	});
	
	mod.hook('S_CURRENT_CHANNEL', 2, (event) => {   		
		chanx = event.channel;
	});
	
	
	function Channel(number)
	{
		if(number >= 0 && number <= 19)
		{
			mod.command.message('Moving to channel ' + String(number + 1));
			mod.toServer('C_SELECT_CHANNEL', 1, {
				unk: 1,
				zone: mod.game.me.zone,
				channel: number
			});
		}
	}
}