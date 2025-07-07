<?php

namespace App\Console\Commands;

use App\Models\Mails\MailLog;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Helpers\MailHelper;

/**
 * Class SendMailCommand
 *
 * Console command to process and send queued emails stored in the mail_logs table.
 * It dynamically renders the content using a mail template and handles attachments, CC, and BCC.
 */
class SendMailCommand extends Command {
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-mail';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sends unsent emails from the mail log using stored templates and attachments.';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle() {
        $mailLogs = MailLog::where('is_sent', false)
            ->with(['mail_template:id,content', 'mail_log_attachments:mail_log_id,file_name,file_path'])
            ->get();

        foreach ($mailLogs as $mailLog) {
            MailHelper::sendMail($mailLog);
        }

        $this->info(count($mailLogs) . " unsent emails have been processed.");
    }
}
