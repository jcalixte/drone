<?php

namespace Drone\HomeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('DroneHomeBundle:Default:index.html.twig');
    }
}
