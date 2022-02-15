function tab(current,start,total){
	var tab = "";
	var bodyTab = "";

	for(i=start;i<=total;i++){
			tab 	= "tab" + i;
			bodyTab = "bodyTab" + i;

			document.getElementById(tab).style.background='#e6e6e6';
			document.getElementById(bodyTab).style.display='none';
	}

	tab = "tab" + current;
	bodyTab = "bodyTab" + current;

	document.getElementById(tab).style.background='#FFFFFF';
	//document.getElementById(tab).style.background='url(images/bg-table.png)';
	//document.getElementById(tab).style.color='#000000';
	document.getElementById(bodyTab).style.display='block';

}
