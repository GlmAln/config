/**
 * stats.js
 * 
 * Javascript API for making ztrack stats calls
 * Stats calls are sent to the server as JSON encoded strings using AJAX
 */

var StatsManager = (new (function() {

	var m_stats = [];
	var m_flushing = false;
	var m_flushingErrorCount = 0;
	var m_flushingErrorMax = 3;
	var m_flushingErrorMaxTotal = 15;
	var ECONOMY_ZERO = "economy_zero";

	/**
	 * Increment a counter
	 *
	 * @param	counter		string 	The counter to increment
	 * @param	kingdom		string	Kingdom in the ontology
	 * @param	phylum		string	Phylum in the ontology
	 * @param	cls		string 	Class in the ontology
	 * @param 	family		string	Famliy in the ontology
	 * @param	genus		string	Genus in the ontology
	 * @param	count		integer	Amount to increment counter by
	 */
	this.count = function(counter, kingdom, phylum, cls, family, genus, count)
	{
		if (!count) {
			count = 1;
		}

		m_stats.push(
		{
			'statfunction':	'count',
			'data' : [
				counter,
				kingdom,
				phylum,
				cls,
				family,
				genus,
				count
			]
		});
		this.flush();
	};

	/**
	 * Prepares a count stat for sending
	 *
	 * @param	counter		string 	The counter to increment
	 * @param	kingdom		string	Kingdom in the ontology
	 * @param	phylum		string	Phylum in the ontology
	 * @param	cls		string 	Class in the ontology
	 * @param 	family		string	Famliy in the ontology
	 * @param	genus		string	Genus in the ontology
	 * @param	count		integer	Amount to increment counter by
	 */
	this.prepareCount = function(counter, kingdom, phylum, cls, family, genus, count)
	{
		if (!count) {
			count = 1;
		}

		var toSend = new Object();
		toSend.ztrackEvent = "count";
		toSend.counter = counter;
		toSend.kingdom = kingdom;
		toSend.phylum = phylum;
		toSend['class'] = cls; //Accessed like this because class is a reserved word
		toSend.family = family;
		toSend.genus = genus;
		toSend.value = count;
		return toSend;

	};

	/**
	 * Increment a counter (sampling version)
	 *
	 * @param   rate		integer	1 out of every rate will be sampled
	 * @param	counter		string 	The counter to increment
	 * @param	kingdom		string	Kingdom in the ontology
	 * @param	phylum		string	Phylum in the ontology
	 * @param	cls 		string 	Class in the ontology
	 * @param 	family		string	Famliy in the ontology
	 * @param	genus		string	Genus in the ontology
	 * @param	count		integer	Amount to increment counter by
	 */
	this.countSample = function(rate, counter, kingdom, phylum, cls, family, genus, count)
	{
		if (!rate) {
			rate = 1;
		}
		if (!count) {
			count = 1;
		}

		m_stats.push(
		{
			'statfunction':	'countSample',
			'data' : [
				rate,
				counter,
				kingdom,
				phylum,
				cls,
				family,
				genus,
				count
			]
		});
		this.flush();
	};

	/**
	 * Prepare a sampled count for sending
	 *
	 * @param   rate		integer	1 out of every rate will be sampled
	 * @param	counter		string 	The counter to increment
	 * @param	kingdom		string	Kingdom in the ontology
	 * @param	phylum		string	Phylum in the ontology
	 * @param	cls 		string 	Class in the ontology
	 * @param 	family		string	Famliy in the ontology
	 * @param	genus		string	Genus in the ontology
	 * @param	count  		integer	Amount to increment counter by
	 */
	this.prepareCountSample = function(rate, counter, kingdom, phylum, cls, family, genus, count)
	{
		if (!rate) {
			rate = 1;
		}
		if (!count) {
			count = 1;
		}

		var toSend = new Object();
		toSend.ztrackEvent = "count";
		toSend.sampleRate = 1/rate;
		toSend.counter = counter;
		toSend.kingdom = kingdom;
		toSend.phylum = phylum;
		toSend['class'] = cls; //Accessed like this because class is a reserved word
		toSend.family = family;
		toSend.genus = genus;
		toSend.value = count;
		return toSend;
	};

	/**
	 * Track performance calls
	 * @param	metric	string	The performance metric to track
	 * @param	kingdom	string	Kingdom in the ontology
	 * @param	phylum	string	Phylum in the ontology
	 * @param	cls 	string 	Class in the ontology
	 * @param	family	string	Famliy in the ontology
	 * @param	genus	string	Genus in the ontology
	 * @param	count	integer	Measurement value
	 */
	this.perf = function(metric, kingdom, phylum, cls, family, genus, count)
	{
		if (!metric) {
			metric = 'request';
		}
		if (!count) {
			count = 1;
		}

		m_stats.push(
		{
			'statfunction':	'perf',
			'data' : [
				metric,
				kingdom,
				phylum,
				cls,
				family,
				genus,
				count
			]
		});
		this.flush();
	};


	/**
	 * Prepare a perf call for sending
	 * @param	metric	string	The performance metric to track
	 * @param	kingdom	string	Kingdom in the ontology
	 * @param	phylum	string	Phylum in the ontology
	 * @param	cls 	string 	Class in the ontology
	 * @param	family	string	Famliy in the ontology
	 * @param	genus	string	Genus in the ontology
	 * @param	count	integer	Measurement value
	 */
	this.preparePerf = function(metric, kingdom, phylum, cls, family, genus, count)
	{
		if (!metric) {
			metric = 'request';
		}
		if (!count) {
			count = 1;
		}

		var toSend = new Object();
		toSend.ztrackEvent = "perf";
		toSend.metric = metric;
		toSend.kingdom = kingdom;
		toSend.phylum = phylum;
		toSend['class'] = cls; //Accessed like this because class is a reserved word
		toSend.family = family;
		toSend.genus = genus;
		toSend.value = count;
		return toSend;
	};

	/**
	 * Track performance calls and sample them
	 * @param	rate		string  Rate at which to sample
	 * @param	metric		string	The performance metric to track
	 * @param	kingdom		string	Kingdom in the ontology
	 * @param	phylum		string	Phylum in the ontology
	 * @param	cls 		string 	Class in the ontology
	 * @param	family		string	Famliy in the ontology
	 * @param	genus		string	Genus in the ontology
	 * @param	count		integer	Measurement value
	 */
	this.perfSample = function(rate, metric, kingdom, phylum, cls, family, genus, count)
	{
		if (!rate) {
			rate = 1;
		}
		if (!metric) {
			metric = 'request';
		}
		if (!count) {
			count = 1;
		}

		m_stats.push(
		{
			'statfunction':	'perfSample',
			'data' : [
				rate,
				metric,
				kingdom,
				phylum,
				cls,
				family,
				genus,
				count
			]
		});
		this.flush();
	};

	/**
	 * Prepare a sampled perf call for sending
	 * @param	rate		string  Rate at which to sample
	 * @param	metric		string	The performance metric to track
	 * @param	kingdom		string	Kingdom in the ontology
	 * @param	phylum		string	Phylum in the ontology
	 * @param	cls 		string 	Class in the ontology
	 * @param	family		string	Famliy in the ontology
	 * @param	genus		string	Genus in the ontology
	 * @param	count		integer	Measurement value
	 */
	this.preparePerfSample = function(rate, metric, kingdom, phylum, cls, family, genus, count)
	{
		if (!rate) {
			rate = 1;
		}
		if (!metric) {
			metric = 'request';
		}
		if (!count) {
			count = 1;
		}

		var toSend = new Object();
		toSend.ztrackEvent = "perf";
		toSend.rate = 1/rate;
		toSend.metric = metric;
		toSend.kingdom = kingdom;
		toSend.phylum = phylum;
		toSend['class'] = cls; //Accessed like this because class is a reserved word
		toSend.family = family;
		toSend.genus = genus;
		toSend.value = count;
		return toSend;
	};


	/**
	 * Log some amount of currency spent
	 *
	 * @param amount			The amount of curency spent
	 * @param resource			The currency that was spent
	 * @param kingdom			The kingdom of where it was spent
	 * @param phylum			The phylum of where it was spent
	 * @param zclass			The class of where it was spent
	 * @param family			The family of where it was spent
	 * @param genus				The genus of where it was spent
	 * @param total_amount		The total amount remaining afterward the spend
	 * @param value2				Hmmm I don't know what this column is for (McG)
	 * @param currency2			^^
	 * @param currency3			^^
	 * @param value3			^^
	 * @param currency4			^^
	 * @param value4			^^record_stats
	 * @param currencyFlow		^^
	 *
	 */
	this.economy = function(amount, resource, kingdom, phylum, zclass, family, genus, total_amount, value2, currency2, currency3, value3, currency4, value4, currencyFlow)
	{
		if (resource == "cash") {
			document.getElementById('flashapp').fireStatsError('trying to log economy with cash as the resource');
			return;
		}

		// We don't want to fire a stat if the amount is 0
		if (amount != 0) {
			m_stats.push(
			{
				'statfunction':	'economy',
				'data' : [
					amount,
					resource,
					kingdom,
					phylum,
					zclass,
					family,
					genus,
					total_amount,
					value2,
					currency2,
					currency3,
					value3,
					currency4,
					value4,
					currencyFlow
				]
			});
			this.flush();
		} else {
			var stat = new Object();
			stat.statfunction = 'countOrSample';
			stat.data = new Array(ECONOMY_ZERO, kingdom, phylum, zclass, family, genus, amount);
			document.getElementById('flashapp').fireStat(stat); //Send back to AS to figure out if should be sampled or unsampled.
		}
	};


	/**
	 * Prepare an economy stat for sending
	 *
	 * @param amount			The amount of curency spent
	 * @param resource			The currency that was spent
	 * @param kingdom			The kingdom of where it was spent
	 * @param phylum			The phylum of where it was spent
	 * @param zclass			The class of where it was spent
	 * @param family			The family of where it was spent
	 * @param genus				The genus of where it was spent
	 * @param total_amount		The total amount remaining afterward the spend
	 * @param value2				Hmmm I don't know what this column is for (McG)
	 * @param currency2			^^
	 * @param currency3			^^
	 * @param value3			^^
	 * @param currency4			^^
	 * @param value4			^^record_stats
	 * @param currencyFlow		^^
	 *
	 */
	this.prepareEconomy = function(amount, resource, kingdom, phylum, zclass, family, genus, total_amount, value2, currency2, currency3, value3, currency4, value4, currencyFlow)
	{
		if (resource == "cash") {
			document.getElementById('flashapp').fireStatsError('trying to log economy with cash as the resource');
			return;
		}

		// We don't want to fire a stat if the amount is 0
		if (amount != 0) {
			var toSend = new Object();
			toSend.ztrackEvent = "economy";
			toSend.amount1 = amount;
			toSend.currency1 = resource;
			toSend.kingdom = kingdom;
			toSend.phylum = phylum;
			toSend['class'] = zclass; //Accessed like this because class is a reserved word
			toSend.family = family;
			toSend.genus = genus;
			toSend.totalAmount = total_amount;
			toSend.amount2 = value2;
			toSend.currency2 = currency2;
			toSend.currency3 = currency3;
			toSend.amount3 = value3;
			toSend.currency4 = currency4;
			toSend.amount4 = value4;
			toSend.currencyFlow = currencyFlow;
			return toSend;
		} else {
			var stat = new Object();
			stat.statfunction = 'countOrSample';
			stat.data = new Array(ECONOMY_ZERO, kingdom, phylum, zclass, family, genus, amount);
			document.getElementById('flashapp').fireStat(stat); //Send back to AS to figure out if should be sampled or unsampled.
		}
	};

	/**
	 * Track a purchase in the goods table
	 *
	 * @param goodName The item being purchased
	 * @param goodType Type of good from the GOODS_ enum
	 * @param value Value of good
	 * @param goodSubType Subtype of good (GOODS_PERPETUAL or "")
	 * @param sampleRate The rate at which to sample (1/rate is the rate used)
	 * @param kingdom Kingdom in the ontology
	 * @param phylum Phylum in the ontology
	 * @param zclass Class in the ontology
	 * @param value2 Value of good in second currency if any
	 * @param currency Currency that was spent
	 * @param amount The amount of currency spent
	 * @param family Family in the ontology
	 * @param genus Genus in the ontology
	 * @param totalAmount The amount of currency remaining after the purchase
	 * @param currency2 Second currency in use if any
	 * @param currency3 Third currency in use if any
	 * @param value3 Value of good in third currency if any
	 * @param currency4 Fourth currency in use if any
	 * @param value4 Value of good in fourth currency
	 * @param currencyFlow Value from the FLOW_ enum in StatsManager
	 * @param paidAmount The amount of premium currency used to purchase the good
	 * @param paidBalance The amount of premium currency left after the purchase
	 * @param freeAmount The amount of freely obtained currency used to purchase the good
	 * @param freeBalance The amount of freely obtained currency left after the purchase
	 * @param itemCode A string to be stored in the use_type field of the ztrack table
	 * @param image_url Currently only used to pass in a sale description from GrantListener
	 *
	 */
	this.goodsPurchase = function(goodName, goodType, value, goodSubType, sampleRate, kingdom, phylum, zclass,
		value2, currency, amount, family, genus, totalAmount, currency2, currency3, value3,
		currency4, value4, currencyFlow, paidAmount, paidBalance, freeAmount, freeBalance, itemCode, imageUrl)
	{
		m_stats.push(
			{
				'statfunction': 'goodsPurchase',
				'data' : [
					goodName,
					goodType,
					value,
					goodSubType,
					sampleRate,
					kingdom,
					phylum,
					zclass,
					value2,
					currency,
					amount,
					family,
					genus,
					totalAmount,
					currency2,
					currency3,
					value3,
					currency4,
					value4,
					currencyFlow,
					paidAmount,
					paidBalance,
					freeAmount,
					freeBalance,
					itemCode,
					imageUrl
				]
		});
	};

	/**
	 * Prepare a goodsPurchase stat for sending
	 *
	 * @param goodName The item being purchased
	 * @param goodType Type of good from the GOODS_ enum
	 * @param value Value of good
	 * @param goodSubType Subtype of good (GOODS_PERPETUAL or "")
	 * @param sampleRate The rate at which to sample (1/rate is the rate used)
	 * @param kingdom Kingdom in the ontology
	 * @param phylum Phylum in the ontology
	 * @param zclass Class in the ontology
	 * @param value2 Value of good in second currency if any
	 * @param currency Currency that was spent
	 * @param amount The amount of currency spent
	 * @param family Family in the ontology
	 * @param genus Genus in the ontology
	 * @param totalAmount The amount of currency remaining after the purchase
	 * @param currency2 Second currency in use if any
	 * @param currency3 Third currency in use if any
	 * @param value3 Value of good in third currency if any
	 * @param currency4 Fourth currency in use if any
	 * @param value4 Value of good in fourth currency
	 * @param currencyFlow Value from the FLOW_ enum in StatsManager
	 * @param paidAmount The amount of premium currency used to purchase the good
	 * @param paidBalance The amount of premium currency left after the purchase
	 * @param freeAmount The amount of freely obtained currency used to purchase the good
	 * @param freeBalance The amount of freely obtained currency left after the purchase
	 * @param itemCode A string to be stored in the use_type field of the ztrack table
	 * @param imageUrl Currently only used to pass in a sale description from GrantListener
	 *
	 */
	this.prepareGoodsPurchase = function(goodName, goodType, value, goodSubType, sampleRate, kingdom, phylum, zclass,
								  value2, currency, amount, family, genus, totalAmount, currency2, currency3, value3,
								  currency4, value4, currencyFlow, paidAmount, paidBalance, freeAmount, freeBalance, itemCode, imageUrl)
	{
		var toSend = new Object();
		toSend.ztrackEvent = "goodsPurchase";
		toSend.goodsName = goodName;
		toSend.goodsType = goodType;
		toSend.value1 = value;
		toSend.goodsSubType = goodSubType;
		toSend.sampleRate = sampleRate;
		toSend.kingdom = kingdom;
		toSend.phylum = phylum;
		toSend['class'] = zclass; //Accessed like this because class is a reserved word
		toSend.value2 = value2;
		toSend.currency1 = currency;
		toSend.amount1 = amount;
		toSend.family = family;
		toSend.genus = genus;
		toSend.totalAmount = totalAmount;
		toSend.currency2 = currency2;
		toSend.currency3 = currency3;
		toSend.value3 = value3;
		toSend.currency4 = currency4;
		toSend.value4 = value4;
		toSend.currencyFlow = currencyFlow;
		toSend.paidAmount = paidAmount;
		toSend.paidBalance = paidBalance;
		toSend.freeAmount = freeAmount;
		toSend.freeBalance = freeBalance;
		toSend.itemCode = itemCode;
		toSend.image_url = imageUrl;
		return toSend;
	};

	/**
	 * Record a milestone for the logged in user
	 *
	 * @param	String	$milestone	The milestone we just hit for this user
	 * @param	Integer	$value 		The value of this milestone
	 */
	this.milestone = function(milestone, value)
	{
		m_stats.push(
		{
			'statfunction':	'milestone',
			'data' : [
				milestone,
				value
			]
		});
		this.flush();
	};

	/**
	 * Prepare a milestone for sending
	 *
	 * @param	milestone	The milestone we just hit for this user
	 * @param	value 		The value of this milestone
	 */
	this.prepareMilestone = function(milestone, value)
	{
		var toSend = new Object();
		toSend.ztrackEvent = "milestone";
		toSend.milestone = milestone;
		toSend.value = value;
		return toSend;
	};

	/**
	 * Track a message sent
	 *
	 * @param	sendKey	String	The sendkey for the message that was clicked
	 */
	this.messageSent = function(sendKey)
	{
		m_stats.push(
		{
			'statfunction': 'messageSent',
			'data' : [
				sendKey
			]
		});
	};

	/**
	 * Prepare a message sent stat for sending
	 *
	 * @param	sendKey	String	The sendkey for the message that was clicked
	 */
	this.prepareMessageSent = function(sendKey)
	{
		var toSend = new Object();
		toSend.ztrackEvent = "messageSendKey";
		toSend.status = 'ok';
		toSend.sendKey = sendKey;
		return toSend;
	};

	/**
	 * Track a click on a message
	 *
	 * @param	sendKey	String	The sendkey for the message that was clicked
	 */
	this.messageClick = function(sendKey)
	{
		m_stats.push(
		{
			'statfunction': 'messageClick',
			'data' : [
				sendKey
			]
		});
	};

	/**
	 * Track a click on a message
	 *
	 * @param	sendKey	String	The sendkey for the message that was clicked
	 */
	this.prepareMessageClick = function(sendKey)
	{
		var toSend = new Object();
		toSend.ztrackEvent = "messageClickSendKey";
		toSend.sendKey = sendKey;
		return toSend;
	};

	/**
	 * Triggers an experiment goal
	 *
	 * @param uid			UID of the player that is triggering the goal
	 * @param testName		Name of the test being triggered
	 * @param goalName		Name of the goal being triggered
	 * @param extraValue	Extra value to log
	 */
	this.experimentGoal = function(testName, goal, extraValue)
	{
		m_stats.push(
			{
				'statfunction': 'experimentGoal',
				'data' : [
					testName,
					goal,
					extraValue
				]
			}
		);
	};

	/**
	 * Triggers an experiment goal
	 *
	 * @param uid			UID of the player that is triggering the goal
	 * @param testName		Name of the test being triggered
	 * @param goalName		Name of the goal being triggered
	 * @param extraValue	Extra value to log
	 */
	this.experimentGoal = function(testName, goal, extraValue)
	{
		m_stats.push(
		{
			'statfunction': 'experimentGoal',
			'data' : [
				testName,
				goal,
				extraValue
			]
		});
	};

	/**
	 * Track a social interaction between two players
	 *
	 * @param 	verb		The verb to increment
	 * @param 	target		The uid of the target for this verb interaction
	 * @param 	kingdom		Kingdom in the ontology
	 * @param 	phylum		Phylum in the ontology
	 * @param 	zclass		Class in the ontology
	 * @param 	object		an optional qualifier
	 * @param 	value		integer an optional quantity for the object
	 * @param 	location	an optional string to set location in the game for origination of call
	 */
	this.social = function(verb, target, kingdom, phylum, zclass, object, value, location) //not sure from the Track api how these map.
	{
		m_stats.push(
		{
			'statfunction': 'social',
			'data' : [
				verb,
				target,
				kingdom,
				phylum,
				zclass,
				object,
				value,
				location
			]
		});
	};

	/**
	 * Track a social interaction between two players
	 *
	 * @param 	verb		The verb to increment
	 * @param 	target		The uid of the target for this verb interaction
	 * @param 	kingdom		Kingdom in the ontology
	 * @param 	phylum		Phylum in the ontology
	 * @param 	zclass		Class in the ontology
	 * @param 	object		an optional qualifier
	 * @param 	value		integer an optional quantity for the object
	 * @param 	location	an optional string to set location in the game for origination of call
	 */
	this.prepareSocial = function(verb, target, kingdom, phylum, zclass, object, value, location)
	{
		var targetArray;
		if(target instanceof Array) {
			targetArray = target;
		} else {
			targetArray = new Array(target);
		}

		var toSend = new Object();
		toSend.ztrackEvent = "social";
		toSend.action = verb;
		toSend.targetZidList = targetArray;
		toSend.kingdom = kingdom;
		toSend.phylum = phylum;
		toSend['class'] = zclass; //Accessed like this because class is a reserved word
		toSend.actionObject = object;
		toSend.amount = value;
		toSend.attribute1 = location;
		return toSend;
	};

	this.deferredTrack = function(batch, key, updateFrequency, flushFrequency)
	{
		m_stats.push(
			{
				'statfunction': 'deferredTrack',
				'batchedfunctions': batch,
				'data' : [
					key,
					updateFrequency,
					flushFrequency
				]
			});
	};

	this.prepareDeferredTrack = function(batch, key, updateFrequency, flushFrequency)
	{
		document.getElementById('flashapp').fireStatsError('Trying to log deferredTrack from JS. Please remove deferredTrack from CLIENT_STATS_LIST in the ZRT.');
	}


	this.flush = function()
	{
		if (m_flushingErrorCount >= m_flushingErrorMaxTotal)
		{
			return;
		}

		if (!m_flushing)
		{
			if (m_stats.length > 0)
			{
                var sessionInfo = API.getSession();

                if(sessionInfo == null) return;

				var l_stats = m_stats;
				m_stats = [];
				m_flushing = true;

				for (var x = 0; x < l_stats.length; x++)
				{
					l_stats[x].snuid = sessionInfo.zid;
				}

				var statsData = JSON.stringify({'stats': l_stats});
				var cacheBust = new Date().getTime().toString() + "|" + (statsData.length*17);
				var zyAuthHash = sessionInfo.zyAuthHash;
				var zySig = sessionInfo.zySig;

				$.ajax({
					url: GAME_URL+"/record_stats.php?zySnid=1&zyAuthHash="+zyAuthHash+"&zySig="+zySig+"&fromJS=1" + "&cacheBust=" + cacheBust,
					data: statsData,
					type: 'post',
					processData: false,
					contentType: 'application/json',
					context: this,
					success: this.flushed
				}).fail(function(xhr,status,error){
					Logger.log("Stats Ajax Failed with Result: "+error);
                    clogged(l_stats);
                });
			}
		}
	};

	this.flushed = function(data)
	{
		m_flushing = false;

		this.flush();
	};

	function clogged(stats)
	{
		m_flushing = false;
		if (++m_flushingErrorCount < m_flushingErrorMax)
		{
			m_stats = m_stats.concat(stats);
			StatsManager.flush();
		}
	};

}));