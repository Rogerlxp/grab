var crawlButtonDefaultText = '一键抓取';
var crawlButtonLoadingText = '请稍等...';
var crawlUrl = function(event){
    event.preventDefault();
    var url = document.getElementById('crawl-url').value;
    if(!validator.isURL(url, {
        protocols: ['http', 'https'],
        require_protocol: true
    })){
        alert('请输入完整的合法url，例如：https://www.baidu.com');
        return;
    }
    var $tbody = $('table.modify-table>tbody');
    var requestCrawlUrl = '//om.iflow.meizu.com/v2/api/crawl/getContent';
    var $crawlBtn = $('#crawl-btn');
    $crawlBtn.text(crawlButtonLoadingText);
    $crawlBtn.attr('disabled', 'disabled');
    $.post(requestCrawlUrl, {url:url})
        .done(function(res){
            var pageVal = res.value;
            $tbody.find('input[name=title]').val(pageVal.title);
            $tbody.find('input[name=author]').val(pageVal.author);
            $tbody.find('input[name=source]').val(pageVal.source);
            $tbody.find('input[name=keywords]').val(pageVal.keywords.join(', '));
            window.now_editor.txt.html(pageVal.content);
            $crawlBtn.removeAttr('disabled');
            $crawlBtn.text(crawlButtonDefaultText);
            console.log(pageVal);
        })
        .fail(function(res){
            console.log('failed.');
            $crawlBtn.removeAttr('disabled');
            $crawlBtn.text(crawlButtonDefaultText);
        });
}
var addCrawlInput = function(){
    var $table = $('table.modify-table');
    var $urlInput = $table.find('#crawl-url-input');
    if($urlInput.length){
        return;
    }else{
        console.log('create element');
        var $inputGroup = $(
            `<tr id="crawl-url-input">
                <th>url：</th>
                <td>
                    <div class="form-group">
                        <input type="text" id="crawl-url" name="url" class="form-control" value="" check-type="text">
                        <button type="button" style="margin-bottom: 0;" id="crawl-btn" class="btn btn-primary ac-sure" onclick="crawlUrl(event)">${crawlButtonDefaultText}</button>
                    </div>
                </td>
            </tr>`);
        $table.find('tbody').prepend($inputGroup);
    }
}