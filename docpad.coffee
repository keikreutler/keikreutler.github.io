# The DocPad Configuration File
# It is simply a CoffeeScript Object which is parsed by CSON
docpadConfig = {

	# =================================
	# Template Data
	# These are variables that will be accessible via our templates
	# To access one of these within our templates, refer to the FAQ: https://github.com/bevry/docpad/wiki/FAQ

	templateData:

		# Specify some site properties
		site:
			# The production url of our website
			url: "http://kei.bio"

			# Here are some old site urls that you would like to redirect from
			oldUrls: [
				'www.keikreutler.com',
				'www.keikreutler.cc',
				'www.keikreutler.info',
				'www.keikreutler.cc/projects'
			]

			# The default title of our website
			title: "Kei Kreutler"

			# The website description (for SEO)
			description: """
				Links in the sand.
				"""

			# The website keywords (for SEO) separated by commas
			keywords: """
				virtual reality, augmented reality, quantified self, future, web design, web development, otherkin, blockchain, mapping, open source, satellites, thick mapping, digital humanities, unmonastery, open space observatory, second foundation, patternist, geolocation, geospatial, frontend development, ui design,
				"""

			# The website author's name
			author: "Kei Kreutler"

			# The website author's email
			email: "chat@kei.bio"

			# Styles
			styles: [
				"//fonts.googleapis.com/css?family=Archivo|Heebo:300,400"
				"//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
				"/styles/style.css"
			]

			# Scripts
			scripts: [
				"//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min.js"
				"//cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr.min.js"
				"//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
				"//cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.1/jquery.lazyload.min.js"
				"//d3js.org/d3.v4.min.js"
				"/scripts/graph.js"
			]



		# -----------------------------
		# Helper Functions

		# Get the prepared site/document title
		# Often we would like to specify particular formatting to our page's title
		# we can apply that formatting here
		getPreparedTitle: ->
			# if we have a document title, then we should use that and suffix the site's title onto it
			if @document.title
				"#{@document.title} | #{@site.title}"
			# if our document does not have it's own title, then we should just use the site's title
			else
				@site.title

		# Get the prepared site/document description
		getPreparedDescription: ->
			# if we have a document description, then we should use that, otherwise use the site's description
			@document.description or @site.description

		# Get the prepared site/document keywords
		getPreparedKeywords: ->
			# Merge the document keywords with the site keywords
			@site.keywords.concat(@document.keywords or []).join(', ')


	# =================================
	# Collections
	# These are special collections that our website makes available to us

	collections:
		pages: (database) ->
			database.findAllLive({pageOrder: $exists: true}, [pageOrder:1,title:1])

		posts: (database) ->
			database.findAllLive({tags:$has:'post'}, [date:-1])


	# =================================
	# Plugins

	plugins:
		ghpages:
			deployRemote: 'origin'
			deployBranch: 'master'
		cleanurls:
			static: true

	# =================================
	# DocPad Events

	# Here we can define handlers for events that DocPad fires
	# You can find a full listing of events on the DocPad Wiki
	events:

		# Server Extend
		# Used to add our own custom routes to the server before the docpad routes are added
		serverExtend: (opts) ->
			# Extract the server from the options
			{server} = opts
			docpad = @docpad

			# As we are now running in an event,
			# ensure we are using the latest copy of the docpad configuraiton
			# and fetch our urls from it
			latestConfig = docpad.getConfig()
			oldUrls = latestConfig.templateData.site.oldUrls or []
			newUrl = latestConfig.templateData.site.url

			# Redirect any requests accessing one of our sites oldUrls to the new site url
			server.use (req,res,next) ->
				if req.headers.host in oldUrls
					res.redirect(newUrl+req.url, 301)
				else
					next()
}


# Export our DocPad Configuration
module.exports = docpadConfig
