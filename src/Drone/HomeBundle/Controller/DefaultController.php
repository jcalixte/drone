<?php

namespace Drone\HomeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('DroneHomeBundle:Default:index.html.twig');
    }

    public function envoiMailAction()
    {
    	$message = \Swift_Message::newInstance()
        ->setSubject('Hello Email')
        ->setFrom('send@example.com')
        ->setTo('recipient@example.com')
        ->setBody('Coucou le monde')
	    ;
	    $this->get('mailer')->send($message);

		$mailer = $this->get('mailer');
		$spool = $mailer->getTransport()->getSpool();
		$transport = $this->get('swiftmailer.transport.real');

		$spool->flushQueue($transport);

        return $this->render('DroneHomeBundle:Default:envoi_mail.html.twig');
    }
}
