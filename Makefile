all :: package
	
package:
	cd framework/ && zip -r app.zip www/* -x www/wrt_preview_frame.html www/wrt_preview_main.html www/preview/ www/*.wgz
	mv framework/app.zip app.wgz
