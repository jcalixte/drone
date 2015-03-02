<?php

namespace Drone\MapBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('DroneMapBundle:Default:index.html.twig', array(
        		'user' => $this->getUser(),
        	));
    }

    public function addFieldAction(Request $request)
    {
    	$data = json_decode($request->getContent());
    	var_dump($data); exit();
    	$response = new JsonResponse();
		$response->setData(array(
			'data' => 123
		));

    	return $response;
    }
}
